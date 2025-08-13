const mongoose = require('mongoose');
const User = require('../models/User');
const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');
const { updateUserGamification } = require('./gamificationService');
const xpRewards = require('../config/xpRewards');
const AppError = require('../utils/errors');
const calculateSocialLevel = require('../utils/calculateSocialLevel');
const badgeManager = require('../utils/badgeManager');

function toNum(v) { if (v === '' || v == null) return undefined; const n = Number(v); return Number.isFinite(n) ? n : undefined; }
function toArr(v) { if (Array.isArray(v)) return v.filter(Boolean).map(String); if (v == null || v === '') return []; return [String(v)]; }
function mapSocialFrequency(v) {
  if (!v) return 'rarely';
  const s = String(v).toLowerCase().trim();
  if (['rarely','sometimes','often','daily'].includes(s)) return s;
  if (['never','seldom','hardly'].includes(s)) return 'rarely';
  if (['occasionally','monthly','weekly'].includes(s)) return 'sometimes';
  if (['frequently'].includes(s)) return 'often';
  if (['everyday','each day'].includes(s)) return 'daily';
  return 'rarely';
}
function mapCommConfidence(v, fallbackAfter) {
  const n = toNum(v);
  if (Number.isFinite(n)) return Math.max(0, Math.min(10, n));
  if (typeof v === 'string') {
    const s = v.toLowerCase().trim();
    if (['very low','very_low','vlow'].includes(s)) return 2;
    if (['low'].includes(s)) return 3;
    if (['med','medium','avg','average'].includes(s)) return 5;
    if (['high'].includes(s)) return 8;
    if (['very high','very_high','vhigh'].includes(s)) return 9;
  }
  if (Number.isFinite(fallbackAfter)) return Math.round(Math.max(0, Math.min(100, fallbackAfter)) / 10);
  return 5;
}
function mapSocialLevelEnum(val, fallbackScore0to100) {
  let score;
  if (typeof val === 'number' && Number.isFinite(val)) score = Math.max(0, Math.min(100, val));
  else if (typeof val === 'string') {
    const s = val.toLowerCase();
    if (['beginner','developing','confident','advanced'].includes(s)) return s;
    const n = toNum(val); if (Number.isFinite(n)) score = Math.max(0, Math.min(100, n));
  }
  if (!Number.isFinite(score) && Number.isFinite(fallbackScore0to100)) score = Math.max(0, Math.min(100, fallbackScore0to100));
  if (!Number.isFinite(score)) return 'beginner';
  if (score < 25) return 'beginner';
  if (score < 50) return 'developing';
  if (score < 75) return 'confident';
  return 'advanced';
}

class SelfAssessmentService {
  normalizeData(raw) {
    const src = raw && typeof raw === 'object' ? (raw.answers && typeof raw.answers === 'object' ? raw.answers : raw) : {};
    const confidenceBefore = toNum(src.confidenceBefore);
    const confidenceAfter  = toNum(src.confidenceAfter);

    // arrays: ensure at least one item to satisfy your schema
    let comfortZones        = toArr(src.comfortZones);        if (comfortZones.length === 0) comfortZones = ['general'];
    let preferredScenarios  = toArr(src.preferredScenarios);  if (preferredScenarios.length === 0) preferredScenarios = ['general'];
    let anxietyTriggers     = toArr(src.anxietyTriggers);     // can be empty

    const data = {
      confidenceBefore,
      confidenceAfter,
      primaryGoal: src.primaryGoal,
      comfortZones,
      preferredScenarios,
      anxietyTriggers,
      socialFrequency: mapSocialFrequency(src.socialFrequency),
      communicationConfidence: mapCommConfidence(src.communicationConfidence ?? src.commConfidence ?? src.communication, confidenceAfter),
    };

    let helperOut;
    try {
      helperOut = calculateSocialLevel({
        communicationConfidence: src.communicationConfidence ?? data.communicationConfidence,
        socialFrequency: src.socialFrequency ?? data.socialFrequency,
        anxietyTriggers,
      });
    } catch { helperOut = undefined; }

    const fallbackScore = Number.isFinite(confidenceAfter) ? confidenceAfter : data.communicationConfidence * 10;
    const socialLevel = mapSocialLevelEnum(helperOut, fallbackScore);

    return { ...data, socialLevel };
  }

  validateAssessmentData(data) {
    const required = ['confidenceBefore','confidenceAfter','primaryGoal','comfortZones','preferredScenarios','socialFrequency','communicationConfidence','socialLevel'];
    for (const key of required) {
      const val = data[key];
      if (['confidenceBefore','confidenceAfter','communicationConfidence'].includes(key)) {
        if (!Number.isFinite(val)) throw new AppError(`Missing or invalid field: ${key}`, 400);
      } else if (['comfortZones','preferredScenarios'].includes(key)) {
        if (!Array.isArray(val) || val.length === 0) throw new AppError(`Missing or invalid field: ${key}`, 400);
      } else {
        if (val === undefined || val === null || val === '') throw new AppError(`Missing required field: ${key}`, 400);
      }
    }
    if (data.confidenceBefore < 0 || data.confidenceBefore > 100) throw new AppError('confidenceBefore out of range', 400);
    if (data.confidenceAfter  < 0 || data.confidenceAfter  > 100) throw new AppError('confidenceAfter out of range', 400);
    if (data.communicationConfidence < 0 || data.communicationConfidence > 10) throw new AppError('communicationConfidence out of range', 400);
  }

  async createAssessment(userId, rawData) {
    const data = this.normalizeData(rawData);
    this.validateAssessmentData(data);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const assessment = await SelfAssessmentRepository.create({ userId, ...data }, session);

      const reward = Number.isFinite(xpRewards?.selfAssessment) ? xpRewards.selfAssessment : 10;
      const { xp, level } = await updateUserGamification(userId, reward, session);

      // Award self-assessment completion badge
      const user = await User.findById(userId).session(session);
      if (user) {
        // Mark user as having completed self-assessment
        user.hasCompletedSelfAssessment = true;
        user.selfAssessmentCompletedAt = new Date();
        
        const newBadges = await badgeManager.checkAchievements(user);
        if (newBadges.length > 0) {
          user.badges = Array.from(new Set([...(user.badges || []), ...newBadges]));
          console.log(`[SelfAssessmentService] Awarded badges: ${newBadges.join(', ')}`);
        }
        
        await user.save({ session });
      }

      await session.commitTransaction();
      return { message: `Self-assessment completed successfully. ${reward} XP added.`, data: assessment, meta: { xp, level } };
    } catch (error) {
      await session.abortTransaction();
      const status = error.statusCode || error.status || 500;
      throw new AppError(error.message || 'Internal Server Error', status);
    } finally { session.endSession(); }
  }

  async updateAssessment(userId, rawData) {
    const data = this.normalizeData(rawData);
    this.validateAssessmentData(data);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updated = await SelfAssessmentRepository.updateLatestByUserId(userId, { ...data }, session);
      if (!updated) throw new AppError('No existing self-assessment to update', 404);

      const reward = Number.isFinite(xpRewards?.selfAssessmentUpdate) ? xpRewards.selfAssessmentUpdate : 10;
      const { xp, level } = await updateUserGamification(userId, reward, session);

      await session.commitTransaction();
      return { message: `Self-assessment updated successfully. ${reward} XP added.`, data: updated, meta: { xp, level } };
    } catch (error) {
      await session.abortTransaction();
      const status = error.statusCode || error.status || 500;
      throw new AppError(error.message || 'Internal Server Error', status);
    } finally { session.endSession(); }
  }

  async getAssessment(userId) {
    return SelfAssessmentRepository.findByUserId(userId);
  }
}
module.exports = new SelfAssessmentService();
