module.exports = function calculateLevel(xp) {
    if (xp >= 1000) return 10;
    if (xp >= 800) return 9;
    if (xp >= 600) return 8;
    if (xp >= 400) return 7;
    if (xp >= 300) return 6;
    if (xp >= 200) return 5;
    if (xp >= 150) return 4;
    if (xp >= 100) return 3;
    if (xp >= 50) return 2;
    return 1;
  };

  