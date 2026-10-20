import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { buildPaths, formatTick, N, niceDomain, pointTime, valueAt, type ChartKind, type Timeframe } from '../chart';
import { useElementSize } from '../hooks';

export type ChartSeries = { name: string; color: string; vals: number[] };

type Props = {
  series: ChartSeries[];
  kind: ChartKind;
  tf: Timeframe;
  end: number;
  /** Fixed height in px; omit to fill the parent's height. */
  height?: number;
  /** Changing this replays the draw-in; any other data change morphs the lines in place. */
  animKey: string;
  /** Hovered point index, or -1. Lifted so headline numbers can follow the cursor. */
  hover: number;
  onHover: (i: number) => void;
  /** Index of the outcome the reader picked; drawn heavier, the rest recede. */
  focus?: number;
};

const PAD = 14;
/** Right-hand gutter for the y-axis labels. */
const GUT = 40;
const REVEAL_MS = 1600;
const MORPH_MS = 700;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Runs `step(eased 0→1)` over `ms` on animation frames. Returns a cancel function. */
function tween(ms: number, ease: (t: number) => number, step: (p: number) => void) {
  if (reducedMotion()) {
    step(1);
    return () => {};
  }
  let raf = 0;
  const t0 = performance.now();
  const frame = (now: number) => {
    const t = Math.max(0, Math.min(1, (now - t0) / ms));
    step(ease(t));
    if (t < 1) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/**
 * Probability chart for the hero stage.
 * - Slide change: lines draw in left to right behind a glowing comet head, area fills sweep in with them.
 * - Timeframe change: lines morph from the old shape to the new one instead of redrawing.
 * - Scrub: a spring-smoothed cursor; the past (left) stays lit, the future (right) dims; values snap per point.
 */
export function Chart({ series, kind, tf, end, height, animKey, hover, onHover, focus = 0 }: Props) {
  const [wrapRef, size] = useElementSize<HTMLDivElement>();
  const SW = size.width;
  const W = Math.max(0, SW - GUT);
  const H = height ?? size.height;

  const targets = useMemo(() => series.map((s) => s.vals), [series]);
  const [disp, setDisp] = useState(targets);
  const dispRef = useRef(targets);
  const [reveal, setReveal] = useState(reducedMotion() ? 1 : 0);
  const lastKey = useRef<string | null>(null);
  const cancel = useRef<() => void>(() => {});

  useEffect(() => {
    cancel.current();
    if (lastKey.current !== animKey) {
      lastKey.current = animKey;
      dispRef.current = targets;
      setDisp(targets);
      setReveal(0);
      cancel.current = tween(REVEAL_MS, easeOutQuart, setReveal);
    } else {
      const from = dispRef.current;
      cancel.current = tween(MORPH_MS, easeInOutCubic, (p) => {
        const d = targets.map((t, i) => t.map((v, k) => (from[i]?.[k] ?? v) + (v - (from[i]?.[k] ?? v)) * p));
        dispRef.current = d;
        setDisp(d);
      });
    }
    return () => cancel.current();
  }, [targets, animKey]);

  // Spring-smoothed cursor position (fractional point index).
  const [cursor, setCursor] = useState(-1);
  const cursorRef = useRef(-1);
  const raf = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (hover < 0) {
      cursorRef.current = -1;
      setCursor(-1);
      return;
    }
    if (cursorRef.current < 0 || reducedMotion()) {
      cursorRef.current = hover;
      setCursor(hover);
      return;
    }
    const frame = () => {
      const c = cursorRef.current + (hover - cursorRef.current) * 0.28;
      const done = Math.abs(hover - c) < 0.01;
      cursorRef.current = done ? hover : c;
      setCursor(cursorRef.current);
      if (!done) raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [hover]);

  const ready = W > 0 && H > 0;
  // The axis follows the displayed lines, so it glides during a morph too.
  const [lo, hi] = useMemo(() => niceDomain(disp), [disp]);
  const drawn = useMemo(
    () => (ready ? disp.map((vals, i) => ({ ...series[i], vals, ...buildPaths(vals, W, H, kind, PAD, lo, hi) })) : []),
    [disp, series, W, H, kind, ready, lo, hi],
  );
  const yOf = (v: number) => PAD + (H - PAD * 2) - ((v - lo) / (hi - lo)) * (H - PAD * 2);
  const step = (hi - lo) / 4;
  const grid = [0, 1, 2, 3, 4].map((k) => lo + step * k);

  const [touching, setTouching] = useState(false);
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const idx = Math.max(0, Math.min(N - 1, Math.round(((e.clientX - r.left) / W) * (N - 1))));
    if (idx !== hover) onHover(idx);
  };
  const leave = () => {
    setTouching(false);
    onHover(-1);
  };

  const hovering = cursor >= 0 && ready && reveal >= 1;
  const cx = hovering ? (cursor / (N - 1)) * W : 0;
  const revealX = reveal * W;
  const headF = reveal * (N - 1);
  const pillLeft = Math.max(44, Math.min(SW - 44, cx));

  return (
    <div className="chart" ref={wrapRef} style={height ? { height } : undefined}>
      {ready && (
        <svg
          viewBox={`0 0 ${SW} ${H}`}
          width={SW}
          height={H}
          className="chart__svg"
          onPointerMove={move}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') setTouching(true);
            move(e);
          }}
          onPointerUp={(e) => e.pointerType !== 'mouse' && leave()}
          onPointerLeave={(e) => (e.pointerType === 'mouse' || !touching) && leave()}
          onPointerCancel={leave}
          role="img"
          aria-label={`Chance over time: ${series.map((s) => `${s.name} ${Math.round(s.vals[N - 1])}%`).join(', ')}`}
        >
          <defs>
            {drawn.map((s, i) => (
              <linearGradient key={i} id={`fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: s.color, stopOpacity: i === focus ? 0.26 : 0.1 }} />
                <stop offset="0.9" style={{ stopColor: s.color, stopOpacity: 0 }} />
              </linearGradient>
            ))}
            <linearGradient id="cursor-line" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--st-ink)', stopOpacity: 0 }} />
              <stop offset="0.2" style={{ stopColor: 'var(--st-ink)', stopOpacity: 0.5 }} />
              <stop offset="1" style={{ stopColor: 'var(--st-ink)', stopOpacity: 0.05 }} />
            </linearGradient>
            <clipPath id="clip-reveal">
              <rect x="-10" y="-10" width={revealX + 10} height={H + 20} />
            </clipPath>
            <clipPath id="clip-past">
              <rect x="-10" y="-10" width={hovering ? cx + 10 : W + 20} height={H + 20} />
            </clipPath>
            <clipPath id="clip-future">
              <rect x={hovering ? cx : W + 20} y="-10" width={W + 20} height={H + 20} />
            </clipPath>
            <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          {grid.map((v, k) => (
            <g key={k} className="chart__grid">
              <line x1={0} x2={W} y1={yOf(v)} y2={yOf(v)} />
              <text x={SW} y={yOf(v) + 4} textAnchor="end">
                {Math.round(v)}%
              </text>
            </g>
          ))}

          <g clipPath="url(#clip-reveal)">
            {(kind === 'area' || drawn.length === 1) &&
              drawn.map((s, i) => (
                <path key={`a${i}`} d={s.area} style={{ fill: `url(#fill-${i})` }} className={hovering ? 'chart__area is-dim' : 'chart__area'} />
              ))}
            {drawn.map((s, i) => (
              <g key={`l${i}`}>
                <path d={s.path} className="chart__line" clipPath="url(#clip-past)" style={{ stroke: s.color, strokeWidth: i === focus ? 3.25 : 2, opacity: drawn.length > 1 && i !== focus ? 0.62 : 1 }} />
                {hovering && <path d={s.path} className="chart__line chart__line--future" clipPath="url(#clip-future)" style={{ stroke: s.color }} />}
              </g>
            ))}
          </g>

          {/* Comet heads lead the draw-in. */}
          {reveal < 1 &&
            drawn.map((s, i) => {
              const y = yOf(valueAt(s.vals, headF));
              return (
                <g key={`c${i}`} style={{ opacity: Math.min(1, (1 - reveal) * 6) }}>
                  <circle cx={revealX} cy={y} r={12} style={{ fill: s.color }} filter="url(#glow)" opacity={0.9} />
                  <circle cx={revealX} cy={y} r={4.5} style={{ fill: 'var(--stage)', stroke: s.color, strokeWidth: 2 }} />
                </g>
              );
            })}

          {/* Live endpoints pulse once drawn. */}
          {reveal >= 1 &&
            !hovering &&
            drawn.map((s, i) => {
              const y = s.pts[N - 1][1];
              return (
                <g key={`e${i}`} className="chart__end">
                  <circle cx={W} cy={y} r={5} className="chart__ripple" style={{ fill: s.color, animationDelay: `${i * 260}ms` }} />
                  <circle cx={W} cy={y} r={5} className="chart__end-dot" style={{ fill: s.color }} />
                  {i === focus && (
                    <g transform={`translate(${W - 14} ${y})`}>
                      {/* Inner group animates; the outer one owns the position (CSS transform would override it). */}
                      <g className="chart__tag">
                        <rect x={-48} y={-12} width={40} height={24} rx={12} style={{ fill: s.color }} />
                        <text x={-28} y={4.5} textAnchor="middle">
                          {Math.round(s.vals[N - 1])}%
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}

          {hovering && (
            <g>
              <line x1={cx} x2={cx} y1={0} y2={H} stroke="url(#cursor-line)" strokeWidth="1.5" />
              {drawn.map((s, i) => {
                const y = yOf(valueAt(s.vals, cursor));
                return (
                  <g key={`h${i}`}>
                    <circle cx={cx} cy={y} r={14} style={{ fill: s.color }} opacity={0.18} />
                    <circle cx={cx} cy={y} r={5.5} style={{ fill: s.color, stroke: 'var(--stage)', strokeWidth: 2.5 }} />
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      )}
      {hovering && (
        <div className="chart__pill" style={{ left: pillLeft }} aria-hidden>
          {formatTick(pointTime(end, tf, hover), tf)}
        </div>
      )}
    </div>
  );
}

/** Small trend line for market cards. Draws itself in when the card is hovered. */
export function Sparkline({ vals, color, up }: { vals: number[]; color: string; up: boolean }) {
  const W = 120, H = 36;
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = Math.max(4, max - min);
  const scaled = vals.map((v) => ((v - min) / span) * 100);
  const { path, area } = buildPaths(scaled, W, H, 'line', 3);
  return (
    <svg className={`spark${up ? ' is-up' : ' is-down'}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <path d={area} className="spark__area" style={{ fill: color }} />
      <path d={path} pathLength={1} className="spark__line" style={{ stroke: color }} />
    </svg>
  );
}
