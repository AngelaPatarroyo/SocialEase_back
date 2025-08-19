'use strict';

const BASE = 100;
const GROWTH = 1.25;

function calculateLevel (totalXp = 0) {
  let level = 1;
  let req = BASE;
  let remaining = totalXp;

  while (remaining >= req) {
    remaining -= req;
    level += 1;
    req = Math.round(req * GROWTH);
  }
  return level;
}

function getLevelProgress (totalXp = 0) {
  let level = 1;
  let req = BASE;
  let remaining = totalXp;

  while (remaining >= req) {
    remaining -= req;
    level += 1;
    req = Math.round(req * GROWTH);
  }
  return {
    level,
    xpIntoLevel: remaining,
    xpToNextLevel: req,
    progressPct: Math.round((remaining / req) * 100)
  };
}

module.exports = { calculateLevel, getLevelProgress };
