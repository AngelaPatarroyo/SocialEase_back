/**
 * Linear-per-level cost:
 *   cost(L) = base * L
 *   cumulative(L) = base * (L-1)*L/2
 * Example (base=100): thresholds = 0, 100, 300, 600, 1000, ...
 *
 * @param {number} base
 * @param {number|null} capLevel  If set (e.g., 50), levels above cap become unreachable.
 * @returns {(level:number)=>number} cumulative XP to reach `level`
 */
function buildLinear(base = 100, capLevel = null) {
  const b = Number(base) || 100;
  const capped = Number.isFinite(capLevel) && capLevel > 0 ? Math.floor(capLevel) : null;

  return (level) => {
    if (level <= 1) return 0;
    // If capped, "next" beyond cap is Infinity so you can’t progress past it
    if (capped && level > capped + 1) return Number.POSITIVE_INFINITY;
    return (b * (level - 1) * level) / 2;
  };
}

/**
 * Explicit thresholds array (1-indexed recommended):
 *   thresholds[1] must be 0 (XP to be level 1).
 *   thresholds[L] = cumulative XP required to REACH level L.
 * Any level beyond provided array is treated as Infinity.
 *
 * Enforces monotonic non-decreasing thresholds to avoid bad curves.
 *
 * @param {number[]} thresholds  e.g., [null, 0, 100, 300, 700, 1500]
 * @returns {(level:number)=>number}
 */
function buildFromArray(thresholds) {
  if (!Array.isArray(thresholds)) {
    throw new Error('buildFromArray: thresholds must be an array');
  }
  // Basic checks
  const t1 = thresholds[1];
  if (!(t1 === 0)) {
    throw new Error('buildFromArray: thresholds[1] must be 0 (XP to start level 1).');
  }
  // Monotonic check
  for (let i = 2; i < thresholds.length; i++) {
    const prev = thresholds[i - 1];
    const cur = thresholds[i];
    if (!(Number.isFinite(prev) && Number.isFinite(cur)) || cur < prev) {
      throw new Error(`buildFromArray: thresholds must be non-decreasing at index ${i}.`);
    }
  }

  return (level) => {
    if (level <= 1) return 0;
    const v = thresholds[level];
    return Number.isFinite(v) ? v : Number.POSITIVE_INFINITY;
  };
}

/**
 * Compute the level for a given XP using a threshold function.
 * @param {number} xp
 * @param {(level:number)=>number} thresholdFn
 */
function levelFromXP(xp = 0, thresholdFn = buildLinear(100)) {
  xp = Math.max(0, Number(xp) || 0);

  let level = 1;
  while (true) {
    const next = thresholdFn(level + 1);
    if (!Number.isFinite(next) || xp < next) break;
    level += 1;
  }
  return level;
}

/**
 * Rich metadata for UI/progress bars.
 * percent is 0..1 within the current level (NaN-safe).
 *
 * @param {number} xp
 * @param {(level:number)=>number} thresholdFn
 * @returns {{
 *   level: number,
 *   xpIntoLevel: number,
 *   xpForNextLevel: number,   // Infinity if capped
 *   xpRemaining: number,      // Infinity if capped
 *   prevTotal: number,
 *   nextTotal: number,        // Infinity if capped
 *   percent: number           // 0..1
 * }}
 */
function levelMeta(xp = 0, thresholdFn = buildLinear(100)) {
  const level = levelFromXP(xp, thresholdFn);
  const prevTotal = thresholdFn(level);       // total XP to reach current level
  const nextTotal = thresholdFn(level + 1);   // total XP to reach next level

  const xpIntoLevel = Math.max(0, (Number(xp) || 0) - prevTotal);
  const xpForNextLevel = Number.isFinite(nextTotal) ? (nextTotal - prevTotal) : Number.POSITIVE_INFINITY;
  const xpRemaining = Number.isFinite(xpForNextLevel) ? Math.max(0, xpForNextLevel - xpIntoLevel) : Number.POSITIVE_INFINITY;

  const percent = Number.isFinite(xpForNextLevel) && xpForNextLevel > 0
    ? Math.min(1, xpIntoLevel / xpForNextLevel)
    : 1; // capped at max level

  return { level, xpIntoLevel, xpForNextLevel, xpRemaining, prevTotal, nextTotal, percent };
}

// Handy ready-made linear(100) function so you can import directly if you want
const linear100 = buildLinear(100);

module.exports = {
  buildLinear,
  buildFromArray,
  levelFromXP,
  levelMeta,
  linear100,
};
