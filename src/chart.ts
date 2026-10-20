export type ChartKind = 'line' | 'area' | 'step';

export const TIMEFRAMES = { '1H': 36e5, '6H': 216e5, '1D': 864e5, '1W': 6048e5, '1M': 2592e6, ALL: 4838e6 } as const;
export type Timeframe = keyof typeof TIMEFRAMES;
export const TF_KEYS = Object.keys(TIMEFRAMES) as Timeframe[];

/** Points per series. */
export const N = 60;

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simulated price history (in %) that drifts towards and ends exactly at `pct`.
 * Deterministic per seed so a market/timeframe always draws the same line.
 */
export function simulateHistory(pct: number, seed: number): number[] {
  const r = seeded(seed);
  const out: number[] = [];
  const v = Math.min(95, Math.max(5, pct + (r() - 0.5) * 36));
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1);
    const target = v + (pct - v) * (k * k);
    const noise = (r() - 0.5) * 11 * Math.sin(Math.PI * k) + Math.sin(k * 9 + seed) * 3;
    out.push(Math.min(99, Math.max(1, target + noise)));
  }
  // Light smoothing so lines read as trends, not noise.
  const sm = out.map((_, i) => (out[Math.max(0, i - 1)] + out[i] * 2 + out[Math.min(N - 1, i + 1)]) / 4);
  sm[N - 1] = pct;
  return sm;
}

export function historySeed(tf: Timeframe, slide: number, outcome: number) {
  return TF_KEYS.indexOf(tf) * 97 + slide * 13 + outcome * 31 + 7;
}

export function formatTick(t: number, tf: Timeframe) {
  const span = TIMEFRAMES[tf];
  const d = new Date(t);
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (span > TIMEFRAMES['1D']) return day;
  return (span === TIMEFRAMES['1D'] ? day + ', ' : '') + d.toTimeString().slice(0, 5);
}

/** Timestamp of point `i` for a series ending at `end`. */
export function pointTime(end: number, tf: Timeframe, i: number) {
  return end - TIMEFRAMES[tf] * (1 - i / (N - 1));
}

type Pt = readonly [number, number];

/** Monotone cubic interpolation (Fritsch–Carlson): smooth, but never overshoots the data. */
function smooth(pts: Pt[]) {
  const n = pts.length;
  if (n < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('');
  const dx: number[] = [], m: number[] = [], t: number[] = new Array(n);
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${(pts[i][0] + h).toFixed(1)} ${(pts[i][1] + h * t[i]).toFixed(1)} ${(pts[i + 1][0] - h).toFixed(1)} ${(pts[i + 1][1] - h * t[i + 1]).toFixed(1)} ${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}`;
  }
  return d;
}

export function buildPaths(vals: number[], W: number, H: number, kind: ChartKind, pad = 0, lo = 0, hi = 100) {
  const ih = H - pad * 2;
  const pts: Pt[] = vals.map((v, k) => [(k / (vals.length - 1)) * W, pad + ih - ((v - lo) / (hi - lo)) * ih]);
  const path =
    kind === 'step'
      ? pts.map((p, k) => (k ? `H${p[0].toFixed(1)}V${p[1].toFixed(1)}` : `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`)).join('')
      : smooth(pts);
  return { pts, path, area: `${path}V${H}H0Z` };
}

/** Value at a fractional index, linearly interpolated. */
export function valueAt(vals: number[], f: number) {
  const i = Math.max(0, Math.min(vals.length - 1, f));
  const a = Math.floor(i), b = Math.min(vals.length - 1, a + 1);
  return vals[a] + (vals[b] - vals[a]) * (i - a);
}

/** A y-axis range that hugs the data (in 10% steps, at least 30 wide) so lines use the full height. */
export function niceDomain(all: number[][]) {
  const flat = all.flat();
  let lo = Math.floor((Math.min(...flat) - 6) / 10) * 10;
  let hi = Math.ceil((Math.max(...flat) + 6) / 10) * 10;
  while (hi - lo < 30) {
    if (lo > 0) lo -= 5;
    if (hi - lo < 30 && hi < 100) hi += 5;
  }
  return [Math.max(0, lo), Math.min(100, hi)] as const;
}
