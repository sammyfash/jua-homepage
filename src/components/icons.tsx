type P = { size?: number; filled?: boolean };

/** Jua wordmark, traced from the brand logo: J (bar + quarter bowl), U (two boxes on a bowl), A (split triangle). */
export const Logo = ({ height = 30, strokeWidth = 2.2 }: { height?: number; strokeWidth?: number }) => (
  <svg width={(height * 112) / 43} height={height} viewBox="37 32 112 43" className="logo" style={{ strokeWidth }} role="img" aria-label="Jua">
    <rect x="61" y="34" width="10" height="39" />
    <path d="M39 53H58V73A19 20 0 0 1 39 53Z" />
    <rect x="76" y="34" width="10" height="20" />
    <rect x="95" y="34" width="10" height="20" />
    <path d="M76 57H105A14.5 16 0 0 1 76 57Z" />
    <path d="M128 34L146.5 73H109.5Z" />
    <path d="M128 36.5V73" style={{ strokeWidth: strokeWidth * 1.9 }} />
  </svg>
);

export const GiftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--gold)" strokeWidth="1.4" aria-hidden>
    <rect x="2" y="6" width="12" height="8" rx="1.5" />
    <path d="M2 9h12M8 6v8M5 6c-2 0-2.5-3-.5-3S8 6 8 6s1.5-3 3.5-3S13 6 11 6" />
  </svg>
);

export const SearchIcon = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <circle cx="7" cy="7" r="5" />
    <path d="M11 11l3.5 3.5" />
  </svg>
);

export const BookmarkIcon = ({ size = 14, filled }: P) => (
  <svg width={size} height={(size * 16) / 14} viewBox="0 0 14 16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M2 1.5h10v13l-5-3.5-5 3.5z" />
  </svg>
);

export const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <circle cx="8" cy="8" r="3.2" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
  </svg>
);

export const MoonIcon = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
    <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" />
  </svg>
);

export const ChevronLeft = ({ size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M9 2L4 7l5 5" />
  </svg>
);

export const ChevronRight = ({ size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 2l5 5-5 5" />
  </svg>
);

export const MarketsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M3 17l5-7 4 4 7-9" />
  </svg>
);

export const PortfolioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <path d="M11 3v8h8" />
  </svg>
);

export const DepositIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <rect x="3" y="5" width="16" height="12" rx="3" />
    <path d="M11 8v6M8 11h6" />
  </svg>
);

export const MoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden>
    <circle cx="5" cy="11" r="1.8" />
    <circle cx="11" cy="11" r="1.8" />
    <circle cx="17" cy="11" r="1.8" />
  </svg>
);

/* ---------- Duotone category + UI icons ---------- */

type DuoProps = { name: string; size?: number };

/** Duotone category icons: a soft brand-coloured tile with an inked glyph. */
export function CatIcon({ name, size = 22 }: DuoProps) {
  const g = (() => {
    switch (name) {
      case 'trending':
        return (
          <>
            <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.6 1.2 2.6 2.2 2.6C10.8 8.5 11 5.6 12 3z" fill="#FF8A4C" />
            <path d="M12 13.5c.8 1 2 1.6 2 3a2 2 0 0 1-4 0c0-.9.6-1.6 1.2-2 0 .5.3.9.8 1z" fill="#FFD066" />
          </>
        );
      case 'flag-ke':
        return (
          <g>
            <clipPath id="ke-c"><circle cx="12" cy="12" r="9" /></clipPath>
            <g clipPath="url(#ke-c)">
              <rect x="2" y="3" width="20" height="6" fill="#000" />
              <rect x="2" y="9" width="20" height="1.2" fill="#fff" />
              <rect x="2" y="10.2" width="20" height="3.6" fill="#BB0000" />
              <rect x="2" y="13.8" width="20" height="1.2" fill="#fff" />
              <rect x="2" y="15" width="20" height="6" fill="#006600" />
              <ellipse cx="12" cy="12" rx="2" ry="4.2" fill="#BB0000" stroke="#fff" strokeWidth=".6" />
            </g>
            <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(0,0,0,.12)" />
          </g>
        );
      case 'flag-ng':
        return (
          <g>
            <clipPath id="ng-c"><circle cx="12" cy="12" r="9" /></clipPath>
            <g clipPath="url(#ng-c)">
              <rect x="3" y="3" width="6" height="18" fill="#008751" />
              <rect x="9" y="3" width="6" height="18" fill="#fff" />
              <rect x="15" y="3" width="6" height="18" fill="#008751" />
            </g>
            <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(0,0,0,.12)" />
          </g>
        );
      case 'globe':
        return (
          <>
            <circle cx="12" cy="12" r="8.5" fill="#5B8DEF" />
            <path d="M7 8.5c2 .2 3 1.5 2.5 3S7.5 13 8 15.5M14 5c-.5 2 1 3 2.5 3.2S18.5 10 18 12M13 14.5c1.5-.5 3 .5 2.6 2.4-.3 1.3-1.6 1.8-2.6 1.6" stroke="#9BE3B4" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );
      case 'ballot':
        return (
          <>
            <rect x="4" y="11" width="16" height="9" rx="2" fill="#BB96E4" />
            <rect x="8" y="4" width="8" height="10" rx="1.5" fill="#fff" stroke="#200D2D" strokeWidth="1.4" />
            <path d="M10 9l1.5 1.5L14 7.5" stroke="#200D2D" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="7" y="13" width="10" height="1.6" rx=".8" fill="#200D2D" />
          </>
        );
      case 'ball':
        return (
          <>
            <circle cx="12" cy="12" r="8.5" fill="#fff" stroke="#200D2D" strokeWidth="1.4" />
            <path d="M12 8.2l3 2.2-1.1 3.5h-3.8L9 10.4z" fill="#200D2D" />
            <path d="M12 8.2V4M15 10.4l3.7-1.3M13.9 13.9l2.3 3.3M10.1 13.9l-2.3 3.3M9 10.4L5.3 9.1" stroke="#200D2D" strokeWidth="1.2" />
          </>
        );
      case 'coin':
        return (
          <>
            <circle cx="12" cy="12" r="8.5" fill="#F7931A" />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke="#FFC46B" strokeWidth="1" />
            <path d="M10 8h3a2 2 0 0 1 0 4h-3zm0 4h3.5a2 2 0 0 1 0 4H10zM11 6.5v1.5M11 16v1.5M13 6.5v1.5M13 16v1.5" stroke="#fff" strokeWidth="1.4" fill="none" />
          </>
        );
      case 'compass':
        return (
          <>
            <circle cx="12" cy="12" r="8.5" fill="#2F3E66" />
            <path d="M12 5.5l2 6.5-2 6.5-2-6.5z" fill="#FF6B5B" />
            <path d="M12 12l2 0-2 6.5-2-6.5z" fill="#fff" />
          </>
        );
      case 'chip':
        return (
          <>
            <rect x="6" y="6" width="12" height="12" rx="2.5" fill="#7FD8C4" />
            <rect x="9" y="9" width="6" height="6" rx="1" fill="#200D2D" />
            <path d="M9 3.5V6M12 3.5V6M15 3.5V6M9 18v2.5M12 18v2.5M15 18v2.5M3.5 9H6M3.5 12H6M3.5 15H6M18 9h2.5M18 12h2.5M18 15h2.5" stroke="#200D2D" strokeWidth="1.3" strokeLinecap="round" />
          </>
        );
      case 'spark':
        return (
          <>
            <path d="M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4z" fill="#FFD066" />
            <circle cx="18.5" cy="5.5" r="1.6" fill="#BB96E4" />
            <circle cx="5.5" cy="18.5" r="1.3" fill="#BB96E4" />
          </>
        );
      default:
        return (
          <>
            <rect x="4" y="4" width="7" height="7" rx="2" fill="#BB96E4" />
            <rect x="13" y="4" width="7" height="7" rx="2" fill="#FFD066" />
            <rect x="4" y="13" width="7" height="7" rx="2" fill="#FFD066" />
            <rect x="13" y="13" width="7" height="7" rx="2" fill="#7FD8C4" />
          </>
        );
    }
  })();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="cat-icon">
      {g}
    </svg>
  );
}

export const ShareIcon = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M8 10V2M5 5l3-3 3 3M3 9v4h10V9" />
  </svg>
);

export const ArrowRight = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const PlayIcon = ({ size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden>
    <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
  </svg>
);

export const InfoIcon = ({ size = 14 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 7v4M8 4.6v.1" strokeLinecap="round" />
  </svg>
);

export const ShieldIcon = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" />
  </svg>
);

export const BoltIcon = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden>
    <path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" />
  </svg>
);

export const CoinsIcon = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
    <ellipse cx="9" cy="7" rx="6" ry="2.5" />
    <path d="M3 7v4c0 1.4 2.7 2.5 6 2.5M3 11v4c0 1.4 2.7 2.5 6 2.5" />
    <ellipse cx="15.5" cy="13" rx="5.5" ry="2.3" />
    <path d="M10 13v4c0 1.3 2.5 2.3 5.5 2.3s5.5-1 5.5-2.3v-4" />
  </svg>
);

export const PlusIcon = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M8 3v10M3 8h10" />
  </svg>
);

export const TrendArrow = ({ up, size = 10 }: { up: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden style={{ transform: up ? undefined : 'rotate(180deg)' }}>
    <path d="M5 1.5L9 7H1z" fill="currentColor" />
  </svg>
);
