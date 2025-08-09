
module.exports = function calculateSocialLevel({ communicationConfidence, socialFrequency, anxietyTriggers }) {

  const conf = Number(communicationConfidence || 0);
  const freqScore = { rarely: 0, sometimes: 1, often: 2, daily: 3 }[socialFrequency] ?? 0;
  const anxietyPenalty = Array.isArray(anxietyTriggers) ? Math.min(anxietyTriggers.length, 3) : 0;

  const score = conf + freqScore * 2 - anxietyPenalty;
  if (score <= 3) return 'beginner';
  if (score <= 8) return 'developing';
  if (score <= 12) return 'confident';
  return 'advanced';
};
