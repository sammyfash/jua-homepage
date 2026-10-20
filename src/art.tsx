import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { PEOPLE, type ArtKind } from './data';

/*
 * Illustrated cover art for markets. Always rendered as the base layer, so every
 * market has a picture even when its photo is missing or blocked; the real photo,
 * when it loads, sits on top (see <Cover>).
 */

type ArtProps = { kind: ArtKind; className?: string };

const Sky = ({ id, a, b, c }: { id: string; a: string; b: string; c?: string }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor={a} />
        {c && <stop offset="0.55" stopColor={c} />}
        <stop offset="1" stopColor={b} />
      </linearGradient>
    </defs>
    <rect width="320" height="200" fill={`url(#${id})`} />
  </>
);

/** Soft dotted texture used across covers for a printed feel. */
const Dots = ({ id, color = '#fff', opacity = 0.12 }: { id: string; color?: string; opacity?: number }) => (
  <>
    <defs>
      <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={color} />
      </pattern>
    </defs>
    <rect width="320" height="200" fill={`url(#${id})`} opacity={opacity} />
  </>
);

/** A flag waving in three bands. */
function WaveFlag({ bands, x = 150, y = 34, w = 150, h = 108, children }: { bands: string[]; x?: number; y?: number; w?: number; h?: number; children?: ReactNode }) {
  const n = bands.length;
  const wave = (yy: number) => `M${x} ${yy} C ${x + w * 0.33} ${yy - 12}, ${x + w * 0.66} ${yy + 12}, ${x + w} ${yy}`;
  return (
    <g>
      <rect x={x - 6} y={y - 6} width="5" height={h + 70} rx="2.5" fill="#2a1a12" opacity="0.85" />
      {bands.map((c, i) => {
        const y0 = y + (h / n) * i;
        const y1 = y + (h / n) * (i + 1);
        return (
          <path
            key={i}
            d={`${wave(y0)} L ${x + w} ${y1} C ${x + w * 0.66} ${y1 + 12}, ${x + w * 0.33} ${y1 - 12}, ${x} ${y1} Z`}
            fill={c}
          />
        );
      })}
      {children}
      <path d={`${wave(y)} L ${x + w} ${y + h} C ${x + w * 0.66} ${y + h + 12}, ${x + w * 0.33} ${y + h - 12}, ${x} ${y + h} Z`} fill="url(#flagShade)" opacity="0.5" />
    </g>
  );
}

const FlagShade = () => (
  <defs>
    <linearGradient id="flagShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity="0" />
      <stop offset="0.3" stopColor="#000" stopOpacity="0.25" />
      <stop offset="0.6" stopColor="#fff" stopOpacity="0.2" />
      <stop offset="1" stopColor="#000" stopOpacity="0.2" />
    </linearGradient>
  </defs>
);

const Ballot = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-34" y="-6" width="68" height="50" rx="6" fill="#fff" />
    <rect x="-34" y="-6" width="68" height="14" rx="6" fill="#e9e3ee" />
    <rect x="-18" y="-1" width="36" height="5" rx="2.5" fill="#200D2D" />
    <g transform="rotate(-8)">
      <rect x="-14" y="-40" width="30" height="38" rx="3" fill="#FFD066" />
      <path d="M-6 -22 l5 5 l10 -12" stroke="#200D2D" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </g>
);

const MaasaiShield = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-30 -46 L30 42 M30 -46 L-30 42" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="0" cy="0" rx="16" ry="34" fill="#BB0000" stroke="#fff" strokeWidth="2" />
    <path d="M0 -34 C 12 -20 12 20 0 34 C -12 20 -12 -20 0 -34Z" fill="#000" opacity="0.85" />
    <ellipse cx="0" cy="0" rx="4" ry="10" fill="#fff" />
    <path d="M-16 -8 Q 0 -2 16 -8 M-16 8 Q 0 2 16 8" stroke="#fff" strokeWidth="1.6" fill="none" />
  </g>
);

function ArtBody({ kind, u }: { kind: ArtKind; u: string }) {
  switch (kind) {
    case 'ng':
      return (
        <>
          <Sky id={`${u}s`} a="#0E5C3A" b="#03271A" />
          <circle cx="250" cy="40" r="90" fill="#1A8A57" opacity="0.35" />
          <FlagShade />
          <WaveFlag bands={['#008751', '#FFFFFF', '#008751']} x={150} y={30} w={150} h={100} />
          <Ballot x={78} y={128} s={1.05} />
          <Dots id={`${u}d`} />
        </>
      );
    case 'niger':
      return (
        <>
          <Sky id={`${u}s`} a="#13734A" b="#0A3B27" />
          <path d="M120 40 l40 -14 l46 10 l30 30 l-6 40 l24 30 l-30 30 l-60 -8 l-40 10 l-30 -30 l4 -50 z" fill="#FFD066" opacity="0.9" />
          <path d="M120 40 l40 -14 l46 10 l30 30 l-6 40 l24 30 l-30 30 l-60 -8 l-40 10 l-30 -30 l4 -50 z" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 5" transform="translate(6 6)" opacity="0.6" />
          <g transform="translate(182 96)">
            <circle r="16" fill="#200D2D" />
            <path d="M0 -8 L2.4 -2.5 L8 -2.5 L3.6 1 L5.2 7 L0 3.6 L-5.2 7 L-3.6 1 L-8 -2.5 L-2.4 -2.5Z" fill="#FFD066" />
          </g>
          <rect x="0" y="0" width="22" height="200" fill="#008751" />
          <rect x="22" y="0" width="22" height="200" fill="#fff" opacity="0.92" />
          <rect x="44" y="0" width="22" height="200" fill="#008751" />
          <Dots id={`${u}d`} />
        </>
      );
    case 'ke':
    case 'ke-podium':
      return (
        <>
          <Sky id={`${u}s`} a={kind === 'ke' ? '#3b0d12' : '#1d1222'} b="#0b0507" />
          <g transform="rotate(-14 160 100)">
            <rect x="-40" y="34" width="420" height="40" fill="#000" />
            <rect x="-40" y="74" width="420" height="8" fill="#fff" />
            <rect x="-40" y="82" width="420" height="40" fill="#BB0000" />
            <rect x="-40" y="122" width="420" height="8" fill="#fff" />
            <rect x="-40" y="130" width="420" height="40" fill="#006600" />
          </g>
          {kind === 'ke' ? (
            <MaasaiShield x={160} y={102} />
          ) : (
            <g transform="translate(160 112)">
              <rect x="-44" y="24" width="88" height="70" rx="6" fill="#200D2D" stroke="#FFD066" strokeWidth="2" />
              <rect x="-30" y="40" width="60" height="6" rx="3" fill="#FFD066" />
              <path d="M0 24 V -6" stroke="#ddd" strokeWidth="4" />
              <rect x="-11" y="-46" width="22" height="40" rx="11" fill="#ececec" />
              <path d="M-11 -30 h22 M-11 -22 h22" stroke="#999" strokeWidth="1.5" />
              <path d="M-26 -60 a40 40 0 0 1 52 0 M-36 -72 a54 54 0 0 1 72 0" stroke="#FFD066" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
            </g>
          )}
          <Dots id={`${u}d`} opacity={0.08} />
        </>
      );
    case 'nairobi':
      return (
        <>
          <Sky id={`${u}s`} a="#2a1446" c="#c2577a" b="#FFB25B" />
          <circle cx="232" cy="132" r="34" fill="#FFE29A" opacity="0.9" />
          <g fill="#1b0b26">
            <rect x="0" y="150" width="320" height="50" />
            <rect x="20" y="118" width="26" height="40" />
            <rect x="52" y="96" width="20" height="60" />
            <rect x="78" y="128" width="34" height="30" />
            {/* KICC */}
            <rect x="122" y="62" width="30" height="96" rx="4" />
            <ellipse cx="137" cy="62" rx="22" ry="6" />
            <rect x="134" y="44" width="6" height="14" />
            <rect x="160" y="108" width="40" height="50" />
            <path d="M206 158 V 124 l16 -12 l16 12 V 158z" />
            <rect x="248" y="88" width="22" height="70" />
            <rect x="276" y="120" width="44" height="38" />
          </g>
          <g fill="#FFD066" opacity="0.7">
            {[70, 82, 94, 106, 118, 130].map((y) => (
              <rect key={y} x="128" y={y} width="18" height="3" rx="1.5" />
            ))}
          </g>
          <Dots id={`${u}d`} opacity={0.08} />
        </>
      );
    case 'lagos':
      return (
        <>
          <Sky id={`${u}s`} a="#41205f" c="#ef7f5a" b="#ffd27a" />
          <circle cx="98" cy="118" r="40" fill="#FFF1C1" opacity="0.95" />
          <g fill="#2a1235">
            <rect x="0" y="120" width="320" height="10" opacity="0" />
            <rect x="150" y="66" width="22" height="66" />
            <rect x="176" y="48" width="18" height="84" />
            <rect x="198" y="80" width="30" height="52" />
            <rect x="232" y="60" width="16" height="72" />
            <rect x="252" y="90" width="36" height="42" />
            <rect x="292" y="74" width="28" height="58" />
            <rect x="20" y="104" width="30" height="28" />
            <rect x="56" y="112" width="18" height="20" />
          </g>
          {/* Third Mainland Bridge over the lagoon */}
          <rect x="0" y="132" width="320" height="68" fill="#3a1d5a" />
          <path d="M0 140 Q 160 128 320 140" stroke="#200D2D" strokeWidth="6" fill="none" />
          {[20, 60, 100, 140, 180, 220, 260, 300].map((x) => (
            <rect key={x} x={x} y="136" width="4" height="16" fill="#200D2D" />
          ))}
          <g stroke="#FFD066" strokeWidth="2" opacity="0.5" strokeLinecap="round">
            <path d="M70 162 h56 M82 172 h32 M90 182 h16" />
          </g>
          <Dots id={`${u}d`} opacity={0.07} />
        </>
      );
    case 'ipo':
      return (
        <>
          <Sky id={`${u}s`} a="#F4E4D4" b="#D97757" />
          <g opacity="0.95">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={36 + i * 26} y={150 - (i + 1) * 17} width="16" height={(i + 1) * 17 + 50} rx="4" fill="#200D2D" opacity={0.18 + i * 0.12} />
            ))}
          </g>
          <path d="M30 150 L 70 128 L 104 136 L 140 98 L 176 104 L 214 58" stroke="#200D2D" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="214" cy="58" r="7" fill="#FFD066" stroke="#200D2D" strokeWidth="3" />
          {/* Opening bell */}
          <g transform="translate(262 108)">
            <path d="M-26 22 C -26 -10 -16 -26 0 -26 C 16 -26 26 -10 26 22 Z" fill="#FFD066" stroke="#200D2D" strokeWidth="3" />
            <rect x="-32" y="20" width="64" height="8" rx="4" fill="#200D2D" />
            <circle cx="0" cy="34" r="6" fill="#200D2D" />
            <path d="M-40 -16 l-10 -8 M40 -16 l10 -8 M-44 4 h-12 M44 4 h12" stroke="#200D2D" strokeWidth="3" strokeLinecap="round" />
          </g>
        </>
      );
    case 'btc':
      return (
        <>
          <Sky id={`${u}s`} a="#2b1405" b="#0d0603" />
          <circle cx="210" cy="96" r="120" fill="#F7931A" opacity="0.14" />
          <g transform="translate(206 96)">
            <circle r="58" fill="#F7931A" />
            <circle r="58" fill="none" stroke="#FFC46B" strokeWidth="4" />
            <circle r="48" fill="none" stroke="#c26a05" strokeWidth="2" strokeDasharray="3 5" />
            <text x="0" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontSize="66" fontWeight="700" fill="#fff" transform="rotate(14)">
              ₿
            </text>
          </g>
          <path d="M0 168 L 40 150 L 70 160 L 104 124 L 130 132 L 160 92" stroke="#FFD066" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 168 L 40 150 L 70 160 L 104 124 L 130 132 L 160 92 V 200 H 0Z" fill="#FFD066" opacity="0.12" />
          <text x="16" y="40" fontFamily="Geist, sans-serif" fontSize="22" fontWeight="700" fill="#FFD066" opacity="0.9">
            $120K
          </text>
          <Dots id={`${u}d`} color="#F7931A" opacity={0.12} />
        </>
      );
    case 'football':
      return (
        <>
          <Sky id={`${u}s`} a="#2f8a3f" b="#16592a" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={i * 40} y="0" width="20" height="200" fill="#fff" opacity="0.05" />
          ))}
          <g stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.75">
            <rect x="14" y="14" width="292" height="172" />
            <path d="M160 14 V186" />
            <circle cx="160" cy="100" r="34" />
            <rect x="14" y="62" width="40" height="76" />
            <rect x="266" y="62" width="40" height="76" />
          </g>
          <g transform="translate(160 100)">
            <circle r="22" fill="#fff" />
            <path d="M0 -9 l8.5 6 l-3.2 10 h-10.6 l-3.2 -10z" fill="#200D2D" />
            <path d="M0 -9 V -22 M8.5 -3 L20 -8 M5.3 7 L13 18 M-5.3 7 L-13 18 M-8.5 -3 L-20 -8" stroke="#200D2D" strokeWidth="2" />
          </g>
          <path d="M228 30 l8 16 l18 2 l-13 12 l4 18 l-17 -9 l-17 9 l4 -18 l-13 -12 l18 -2z" fill="#FFD066" />
        </>
      );
    case 'globe':
      return (
        <>
          <Sky id={`${u}s`} a="#16224a" b="#070b1d" />
          <g transform="translate(176 104)">
            <circle r="74" fill="#1f3f86" />
            <circle r="74" fill="none" stroke="#7fb0ff" strokeWidth="1.5" opacity="0.6" />
            <g stroke="#7fb0ff" strokeWidth="1" fill="none" opacity="0.45">
              <ellipse rx="30" ry="74" />
              <ellipse rx="58" ry="74" />
              <path d="M-74 0 H74 M-66 -34 H66 M-66 34 H66" />
            </g>
            <path d="M-40 -40 q 20 -14 40 -4 q 14 12 0 24 q -20 6 -26 22 q -14 -6 -18 -20 q -8 -10 4 -22z" fill="#6bbf8e" opacity="0.85" />
            <path d="M14 10 q 22 -6 34 8 q 6 18 -10 30 q -20 6 -26 -10 q -8 -14 2 -28z" fill="#6bbf8e" opacity="0.85" />
          </g>
          <g transform="translate(206 92)">
            <path d="M0 0 C -12 -14 -12 -30 0 -32 C 12 -30 12 -14 0 0Z" fill="#FF6B5B" stroke="#fff" strokeWidth="2" />
            <circle cy="-20" r="4" fill="#fff" />
          </g>
          <Dots id={`${u}d`} opacity={0.1} />
        </>
      );
    case 'atom':
      return (
        <>
          <Sky id={`${u}s`} a="#2a0f1f" b="#0a0408" />
          <circle cx="170" cy="100" r="80" fill="#ff7a59" opacity="0.15" />
          <g transform="translate(170 100)" fill="none" strokeWidth="2.5">
            <ellipse rx="70" ry="24" stroke="#FFD066" />
            <ellipse rx="70" ry="24" stroke="#BB96E4" transform="rotate(60)" />
            <ellipse rx="70" ry="24" stroke="#ff8a6b" transform="rotate(-60)" />
            <circle r="12" fill="#FFD066" stroke="none" />
            <circle cx="70" cy="0" r="5" fill="#FFD066" stroke="none" />
            <circle cx="-35" cy="60" r="5" fill="#BB96E4" stroke="none" />
            <circle cx="-35" cy="-60" r="5" fill="#ff8a6b" stroke="none" />
          </g>
          <Dots id={`${u}d`} opacity={0.08} />
        </>
      );
  }
}

export function MarketArt({ kind, className }: ArtProps) {
  const u = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false">
      <ArtBody kind={kind} u={u} />
    </svg>
  );
}

/** Market picture: illustrated art as the base, the market's photo on top once it loads. */
export function Cover({ kind, img, className = '' }: { kind: ArtKind; img?: string; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <span className={`cover ${className}`}>
      <MarketArt kind={kind} className="cover__art" />
      {img && <img className={`cover__img${ok ? ' is-loaded' : ''}`} src={img} alt="" loading="lazy" onLoad={() => setOk(true)} onError={(e) => (e.currentTarget.style.display = 'none')} />}
    </span>
  );
}

const AVATAR_TONES = [
  ['#FFD066', '#200D2D'],
  ['#BB96E4', '#200D2D'],
  ['#7FD8C4', '#0f2e28'],
  ['#FF9F7F', '#3a130a'],
  ['#9DB8FF', '#121c3a'],
  ['#F7F3F9', '#200D2D'],
];

/** Outcome avatar: the person's photo when we have one, otherwise initials on a brand tone. */
export function Avatar({ name, size = 28, tone, ring }: { name: string; size?: number; tone?: number; ring?: string }) {
  const [failed, setFailed] = useState(false);
  const words = name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  const initials = /^\w{3} \d/.test(name) ? name.slice(0, 3) : (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '');
  const h = tone ?? [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [bg, fg] = AVATAR_TONES[h % AVATAR_TONES.length];
  const person = PEOPLE[name];
  return (
    <span
      className={`avatar${person && !failed ? ' avatar--photo' : ''}`}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.38, boxShadow: ring ? `0 0 0 2px var(--surface), 0 0 0 3.5px ${ring}` : undefined }}
      title={person && !failed ? `${name}. Photo: ${person.credit}` : undefined}
      aria-hidden
    >
      {initials.toUpperCase()}
      {person && !failed && <img src={person.photo} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />}
    </span>
  );
}
