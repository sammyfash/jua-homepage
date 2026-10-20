import type { ReactNode } from 'react';
import { CATEGORIES } from '../data';
import type { Currency } from '../format';
import { BookmarkIcon, CatIcon, GiftIcon, Logo, MoonIcon, SearchIcon, SunIcon } from './icons';

export type Theme = 'light' | 'dark';

export function PromoBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="promo">
      <GiftIcon />
      <span>
        <b>Get KSh 50.00 free credit</b> when you sign up. <span className="promo__accent">Only 422 spots left.</span>
      </span>
      <a href="#" className="promo__cta">
        Claim it
      </a>
      <button type="button" className="promo__close" aria-label="Dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}

export function PromoBannerMobile() {
  return (
    <div className="promo-m">
      <span>
        <b>KSh 50.00 free credit</b> on sign up
      </span>
      <a href="#" className="promo-m__cta">
        Claim
      </a>
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; label: ReactNode; aria?: string; icon?: boolean }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          className={`seg__opt${o.icon ? ' seg__opt--icon' : ''}`}
          aria-pressed={value === o.v}
          aria-label={o.aria}
          onClick={() => onChange(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type NavProps = {
  cur: Currency;
  setCur: (c: Currency) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  savedCount: number;
  query: string;
  setQuery: (q: string) => void;
};

export function NavDesktop({ cur, setCur, theme, setTheme, savedCount, query, setQuery }: NavProps) {
  return (
    <header className="nav">
      <a href="#" className="nav__logo" aria-label="Jua">
        <Logo height={30} />
      </a>
      <label className="search">
        <SearchIcon />
        <input id="search" type="search" placeholder="Search elections, crypto, football…" aria-label="Search markets" value={query} onChange={(e) => setQuery(e.target.value)} />
        <kbd className="search__kbd">/</kbd>
      </label>
      <div className="nav__right">
        <a href="#how-it-works" className="nav__link">
          How it works
        </a>
        <Segmented
          label="Currency"
          value={cur}
          onChange={setCur}
          options={[
            { v: 'KES', label: 'KES' },
            { v: 'USDC', label: 'USDC' },
          ]}
        />
        <a href="#" className="btn-outline nav__saved">
          <BookmarkIcon />
          Saved
          <span className="badge">{savedCount}</span>
        </a>
        <Segmented
          label="Theme"
          value={theme}
          onChange={setTheme}
          options={[
            { v: 'light', label: <SunIcon />, aria: 'Light', icon: true },
            { v: 'dark', label: <MoonIcon />, aria: 'Dark', icon: true },
          ]}
        />
        <a href="#" className="nav__login">
          Log in
        </a>
        <a href="#" className="btn-primary nav__signup">
          Sign up
        </a>
      </div>
    </header>
  );
}

export function NavMobile({ cur, setCur, theme, setTheme, savedCount, query, setQuery }: NavProps) {
  return (
    <header className="nav-m">
      <a href="#" aria-label="Jua" className="nav-m__logo">
        <Logo height={22} />
      </a>
      <label className="search search--m">
        <SearchIcon size={14} />
        <input id="search-m" type="search" placeholder="Search" aria-label="Search markets" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <button type="button" className="icon-btn icon-btn--text" onClick={() => setCur(cur === 'KES' ? 'USDC' : 'KES')} aria-label={`Currency: ${cur}. Switch`}>
        {cur}
      </button>
      <button type="button" className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        <MoonIcon size={15} />
      </button>
      <a href="#" className="icon-btn" aria-label={`Saved (${savedCount})`}>
        <BookmarkIcon size={13} />
        <span className="badge badge--float">{savedCount}</span>
      </a>
    </header>
  );
}

export function Categories({ active, onPick, mobile }: { active: number; onPick: (i: number) => void; mobile?: boolean }) {
  return (
    <nav className={mobile ? 'cats cats--m' : 'cats'} aria-label="Categories">
      {CATEGORIES.map(({ label, icon }, i) => (
        <button
          key={label}
          type="button"
          className={`cats__item${!mobile && i === 3 ? ' cats__item--gap' : ''}`}
          aria-current={i === active ? 'page' : undefined}
          onClick={() => onPick(i)}
        >
          <CatIcon name={icon} size={mobile ? 16 : 18} />
          {label}
        </button>
      ))}
    </nav>
  );
}
