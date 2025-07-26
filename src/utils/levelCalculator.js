// utils/levelCalculator.js
function calculateLevel(xp) {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 700) return 3;
    if (xp < 1500) return 4;
    return 5; // Example cap for now
  }
  
  module.exports = { calculateLevel };
  