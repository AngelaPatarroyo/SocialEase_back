const SelfAssessmentRepository = require('../repositories/SelfAssessmentRepository');

class SelfAssessmentService {
  async createAssessment(userId, data) {
    return await SelfAssessmentRepository.create({ userId, ...data });
  }

  async getAssessment(userId) {
    return await SelfAssessmentRepository.findByUserId(userId);
  }
}

module.exports = new SelfAssessmentService();
