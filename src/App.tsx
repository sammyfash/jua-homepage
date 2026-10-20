import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, MARKETS } from './data';
import { makeFormatters, type Currency } from './format';
import { useMediaQuery, usePersistentState } from './hooks';
import { Hero } from './components/Hero';
import { Categories, NavDesktop, NavMobile, PromoBanner, PromoBannerMobile, type Theme } from './components/Header';
import { Faq, Footer, HotTopics, HowItWorks, MarketCard, TabBar } from './components/Sections';
import { CatIcon, SearchIcon } from './components/icons';

const PAGE = { desktop: 12, mobile: 4 };

export function App() {
  const mobile = useMediaQuery('(max-width: 760px)');
  const [theme, setTheme] = usePersistentState<Theme>('jua:theme', 'light');
  const [cur, setCur] = usePersistentState<Currency>('jua:currency', 'KES');
  const [saved, setSaved] = usePersistentState<Record<string, boolean>>('jua:saved', {});
  const [cat, setCat] = useState(0);
  const [query, setQuery] = useState('');
  const [promo, setPromo] = useState(true);
  const [limit, setLimit] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // "/" jumps to search, like most trading apps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || /input|textarea/i.test((e.target as HTMLElement).tagName)) return;
      e.preventDefault();
      document.getElementById(mobile ? 'search-m' : 'search')?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobile]);

  const fmt = useMemo(() => makeFormatters(cur), [cur]);
  const toggleSave = (id: string) => setSaved((s) => ({ ...s, [id]: !s[id] }));
  const savedCount = Object.values(saved).filter(Boolean).length;

  const catLabel = CATEGORIES[cat].label;
  const q = query.trim().toLowerCase();
  const grid = MARKETS.filter(
    (m) =>
      (cat === 0 || m.tags.includes(catLabel)) &&
      (!q || [m.title, m.cat, ...m.tags, ...m.outcomes.map((o) => o.name)].some((t) => t.toLowerCase().includes(q))),
  );
  const pageSize = mobile ? PAGE.mobile : PAGE.desktop;
  const shown = grid.slice(0, limit ?? pageSize);
  const gridTitle = q ? `Results for “${query.trim()}”` : cat === 0 ? 'All markets' : catLabel;

  const pickCat = (i: number) => {
    setCat(i);
    setLimit(null);
  };
  const pickTopic = (name: string) => {
    const i = CATEGORIES.findIndex((c) => c.label === name);
    if (i >= 0) pickCat(i);
    else setQuery(name.split(/[ ,]/)[0]);
    document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' });
  };
  const howItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });

  const navProps = { cur, setCur, theme, setTheme, savedCount, query, setQuery };

  return (
    <div className={mobile ? 'page page--m' : 'page'}>
      {mobile ? <PromoBannerMobile /> : promo && <PromoBanner onDismiss={() => setPromo(false)} />}
      {mobile ? <NavMobile {...navProps} /> : <NavDesktop {...navProps} />}
      <Categories active={cat} onPick={pickCat} mobile={mobile} />
      <main>
        <div className="wrap">
          <Hero fmt={fmt} cur={cur} saved={saved} toggleSave={toggleSave} mobile={mobile} onHowItWorks={howItWorks} />
        </div>

        <section className="wrap markets" id="markets" aria-label={gridTitle}>
          <div className="section-head section-head--row">
            <div className="markets__title">
              <span className="markets__icon">
                <CatIcon name={CATEGORIES[cat].icon} size={22} />
              </span>
              <h2 className="section-title">{gridTitle}</h2>
              <span className="markets__count">
                {grid.length} live {grid.length === 1 ? 'market' : 'markets'}
              </span>
            </div>
            {!mobile && (
              <div className="markets__filters">
                <span className="chip-static">Sort: 24h volume</span>
                <span className="chip-static">Live only</span>
              </div>
            )}
          </div>
          {grid.length ? (
            <div className="markets__grid">
              {shown.map((m, i) => (
                <MarketCard key={m.id} m={m} fmt={fmt} saved={!!saved[m.id]} onToggleSave={() => toggleSave(m.id)} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <SearchIcon size={22} />
              <div className="empty__title">No markets match “{query.trim()}”</div>
              <p>Try a name, a country or a topic, such as Ruto, Lagos or Bitcoin.</p>
              <button type="button" className="btn-outline" onClick={() => { setQuery(''); pickCat(0); }}>
                Show all markets
              </button>
            </div>
          )}
          {shown.length < grid.length && (
            <div className="markets__more">
              <button type="button" className="btn-outline" onClick={() => setLimit(grid.length)}>
                Show {grid.length - shown.length} more markets
              </button>
            </div>
          )}
        </section>

        <div className="wrap">
          <HowItWorks />
        </div>
        <div className="wrap">
          <HotTopics fmt={fmt} onPick={pickTopic} />
        </div>
        <div className="wrap">
          <Faq />
        </div>
      </main>
      <Footer />
      {mobile && <TabBar />}
    </div>
  );
}
