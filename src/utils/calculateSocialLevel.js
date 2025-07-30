module.exports = function calculateSocialLevel({ communicationConfidence, socialFrequency, anxietyTriggers = [] }) {
  let score = 0;

  if (communicationConfidence < 4) score += 2;
  else if (communicationConfidence < 7) score += 1;

  if (socialFrequency === 'rarely') score += 2;
  else if (socialFrequency === 'monthly') score += 1;

  if (anxietyTriggers.length > 1) score += 2;
  else if (anxietyTriggers.length === 1) score += 1;

  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
};
