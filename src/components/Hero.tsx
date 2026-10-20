import { useMemo, useState } from 'react';
import { Avatar, Cover } from '../art';
import { historySeed, simulateHistory, TF_KEYS, TIMEFRAMES, formatTick, type Timeframe } from '../chart';
import { CATEGORIES, FEATURED_IDS, FEATURED_KINDS, MARKETS, SLIDE_MS, STAGE_COLORS } from '../data';
import { RATE, type Currency, type Formatters } from '../format';
import { Chart, type ChartSeries } from './Chart';
import { RollingNumber } from './RollingNumber';
import { ArrowRight, BookmarkIcon, CatIcon, ChevronLeft, ChevronRight, InfoIcon, PlayIcon, ShareIcon, TrendArrow } from './icons';

const COUNT = FEATURED_IDS.length;
const TF_LABEL: Record<Timeframe, string> = { '1H': 'past hour', '6H': 'past 6 hours', '1D': 'today', '1W': 'this week', '1M': 'this month', ALL: 'all time' };
const STAKES: Record<Currency, number[]> = { KES: [100, 500, 1000], USDC: [1, 5, 10] };

/** One plain-English reading of a probability, for people who don't trade. */
function reading(pct: number) {
  if (pct >= 80) return 'Traders think this is very likely.';
  if (pct >= 60) return 'Traders think this is likely.';
  if (pct > 52) return 'Traders lean towards yes, but it is close.';
  if (pct >= 48) return 'A coin flip. Traders are split down the middle.';
  if (pct >= 35) return 'Traders lean towards no, but it is close.';
  if (pct >= 15) return 'Traders think this is unlikely.';
  return 'Traders think this is very unlikely.';
}

type Props = {
  fmt: Formatters;
  cur: Currency;
  saved: Record<string, boolean>;
  toggleSave: (id: string) => void;
  mobile: boolean;
  onHowItWorks: () => void;
};

export function Hero({ fmt, cur, saved, toggleSave, mobile, onHowItWorks }: Props) {
  const [slide, setSlide] = useState(0);
  const [tf, setTf] = useState<Timeframe>('1M');
  const [hover, setHover] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);
  const [side, setSide] = useState<'yes' | 'no'>('yes');
  const [stakeIdx, setStakeIdx] = useState(0);
  const [end] = useState(() => Date.now());

  const fi = ((slide % COUNT) + COUNT) % COUNT;
  const F = MARKETS.find((m) => m.id === FEATURED_IDS[fi])!;
  const isBin = F.outcomes.length === 1;
  const kind = FEATURED_KINDS[fi];
  const catIcon = CATEGORIES.find((c) => c.label === F.tags[0])?.icon ?? 'grid';

  const go = (to: number) => {
    setSlide(to);
    setSelected(0);
    setSide('yes');
    setHover(-1);
  };

  const series: ChartSeries[] = useMemo(
    () =>
      F.outcomes.map((o, i) => ({
        name: isBin ? 'Yes' : o.name,
        color: STAGE_COLORS[i],
        vals: simulateHistory(o.pct, historySeed(tf, fi, i)),
      })),
    [F, isBin, tf, fi],
  );

  const sel = Math.min(selected, F.outcomes.length - 1);
  const focus = series[sel];
  const livePct = F.outcomes[sel].pct;
  const shownPct = hover >= 0 ? Math.round(focus.vals[hover]) : livePct;
  const delta = Math.round(focus.vals[focus.vals.length - 1] - focus.vals[0]);
  const hoverDate = hover >= 0 ? formatTick(end - TIMEFRAMES[tf] * (1 - hover / (focus.vals.length - 1)), tf) : null;

  // Payout maths: one share pays KSh 130 (1 USDC) if the outcome happens.
  const price = side === 'yes' ? livePct : 100 - livePct;
  const stake = STAKES[cur][stakeIdx];
  const payout = (stake * 100) / price;
  const money = (v: number) => (cur === 'USDC' ? `$${v.toFixed(2)}` : `KSh ${Math.round(v).toLocaleString('en-KE')}`);
  const selName = F.outcomes[sel].name;
  const outcomeLabel = isBin ? (side === 'yes' ? 'Yes' : 'No') : selName.length > 14 ? selName.split(' ').slice(-1)[0] : selName;

  const playing = !paused && hover < 0;
  const xLabels = (mobile ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map((k) => formatTick(end - TIMEFRAMES[tf] * (1 - k), tf));
  const tfKeys: Timeframe[] = mobile ? ['1D', '1W', '1M', 'ALL'] : TF_KEYS;

  return (
    <section
      className="stage"
      aria-roledescription="carousel"
      aria-label="Featured markets"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="stage__glow" aria-hidden />
      <div className="stage__grain" aria-hidden />

      <div className="stage__main" key={F.id}>
        {/* ---------- left: the question, in plain words ---------- */}
        <div className="stage__story">
          <div className="stage__chips">
            <span className="stage__chip">
              <CatIcon name={catIcon} size={18} />
              {F.tags[0]}
            </span>
            <span className="stage__live">
              <span className="pulse-dot" />
              Live
            </span>
            <span className="stage__actions">
              <button type="button" className="stage__icon" onClick={() => toggleSave(F.id)} aria-pressed={!!saved[F.id]} aria-label={saved[F.id] ? 'Remove from saved' : 'Save market'}>
                <BookmarkIcon size={13} filled={saved[F.id]} />
              </button>
              <button type="button" className="stage__icon" aria-label="Share market">
                <ShareIcon size={15} />
              </button>
            </span>
          </div>

          <div className="stage__title-row">
            <Cover kind={F.art} img={F.img} className="stage__thumb" />
            <div className="stage__titles">
              <h1 className="stage__title">{F.title}</h1>
              <div className="stage__sub">
                {fmt.vol(F.vol)} traded <span className="dot-sep" /> Closes in {F.closes}
              </div>
            </div>
          </div>

          <div className="stage__number">
            <RollingNumber value={`${shownPct}%`} className="stage__pct" />
            <div className="stage__number-side">
              <span className="stage__chance">
                <span className="swatch" style={{ background: focus.color }} aria-hidden />
                {isBin ? 'chance of Yes' : `chance for ${F.outcomes[sel].name}`}
              </span>
              {hoverDate ? (
                <span className="stage__delta stage__delta--date">on {hoverDate}</span>
              ) : (
                <span className={`stage__delta ${delta >= 0 ? 'is-up' : 'is-down'}`}>
                  <TrendArrow up={delta >= 0} />
                  {Math.abs(delta)} pts {TF_LABEL[tf]}
                </span>
              )}
            </div>
          </div>
          <p className="stage__reading">
            {isBin ? reading(livePct) : `${F.outcomes[0].name} leads with ${F.outcomes[0].pct}%. Tap a name to follow their line.`}
          </p>

          {isBin ? (
            <div className="sides" role="radiogroup" aria-label="Pick a side">
              {(['yes', 'no'] as const).map((s) => (
                <button key={s} type="button" role="radio" aria-checked={side === s} className={`side side--${s}`} onClick={() => setSide(s)}>
                  <span className="side__label">{s === 'yes' ? 'Yes' : 'No'}</span>
                  <span className="side__price">{fmt.price(s === 'yes' ? livePct : 100 - livePct)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="runners" role="radiogroup" aria-label="Pick an outcome">
              {F.outcomes.slice(0, 4).map((o, i) => (
                <button
                  key={o.name}
                  type="button"
                  role="radio"
                  aria-checked={sel === i}
                  className="runner"
                  onClick={() => {
                    setSelected(i);
                    setSide('yes');
                  }}
                  style={{ ['--c' as string]: STAGE_COLORS[i] }}
                >
                  <Avatar name={o.name} size={34} tone={i} ring={STAGE_COLORS[i]} />
                  <span className="runner__body">
                    <span className="runner__top">
                      <span className="runner__name">{o.name}</span>
                      <span className="runner__pct">{o.pct}%</span>
                    </span>
                    <span className="runner__bar">
                      <span style={{ width: `${o.pct}%`, animationDelay: `${200 + i * 90}ms` }} />
                    </span>
                  </span>
                  <span className="runner__buy">Yes {fmt.price(o.pct)}</span>
                </button>
              ))}
              {F.extra ? <div className="runners__more">+{F.extra} more outcomes</div> : null}
            </div>
          )}
        </div>

        {/* ---------- right: the chart, then what it means for your money ---------- */}
        <div className="stage__chart">
          <div className="stage__chart-top">
            <div className="legend">
              {series.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  className={`legend__item${i === sel ? ' is-active' : ''}`}
                  onClick={() => setSelected(i)}
                  disabled={isBin}
                >
                  <span className="legend__dot" style={{ background: s.color }} />
                  <span className="legend__name">{s.name}</span>
                  <RollingNumber value={`${hover >= 0 ? Math.round(s.vals[hover]) : F.outcomes[i].pct}%`} className="legend__val" />
                </button>
              ))}
            </div>
            <div className="tfs" role="group" aria-label="Timeframe" style={{ ['--i' as string]: tfKeys.indexOf(tf), ['--n' as string]: tfKeys.length }}>
              <span className="tfs__thumb" aria-hidden />
              {tfKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="tfs__btn"
                  aria-pressed={k === tf}
                  onClick={() => {
                    setTf(k);
                    setHover(-1);
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="stage__plot">
            <Chart series={series} kind={kind} tf={tf} end={end} height={mobile ? 220 : undefined} animKey={F.id} hover={hover} onHover={setHover} focus={sel} />
          </div>
          <div className="stage__xaxis" aria-hidden>
            {xLabels.map((x, i) => (
              <span key={i}>{x}</span>
            ))}
          </div>

          <div className="payout">
            <div className="payout__in">
              <span className="payout__label">If you put in</span>
              <span className="stakes" role="radiogroup" aria-label="Amount">
                {STAKES[cur].map((s, i) => (
                  <button key={s} type="button" role="radio" aria-checked={stakeIdx === i} onClick={() => setStakeIdx(i)}>
                    {cur === 'USDC' ? `$${s}` : `KSh ${s.toLocaleString('en-KE')}`}
                  </button>
                ))}
              </span>
            </div>
            <span className="payout__arrow" aria-hidden>
              <ArrowRight size={18} />
            </span>
            <div className="payout__out">
              <span className="payout__label">
                on <b>{outcomeLabel}</b>, you get
              </span>
              <span className="payout__line">
                <RollingNumber value={money(payout)} className="payout__amount" />
                <span className="payout__profit">
                  +{money(payout - stake)}
                  <span className="tip" tabIndex={0} aria-label={`Each share costs ${fmt.price(price)} and pays ${cur === 'USDC' ? '$1.00' : `KSh ${RATE}`} if it happens. You can sell any time before the market closes.`}>
                    <InfoIcon size={13} />
                  </span>
                </span>
              </span>
            </div>
            <div className="payout__ctas">
              <a href="#" className="btn-gold">
                Start predicting
                <ArrowRight />
              </a>
              <button type="button" className="btn-ghost" onClick={onHowItWorks} aria-label="How it works">
                <PlayIcon />
                <span className="btn-ghost__text">How it works</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- carousel ---------- */}
      <div className="reel">
        <div className="reel__track" role="tablist" aria-label="Featured markets">
          {FEATURED_IDS.map((id, i) => {
            const m = MARKETS.find((x) => x.id === id)!;
            const active = i === fi;
            return (
              <button key={id} type="button" role="tab" aria-selected={active} className="reel__card" onClick={() => go(i)}>
                <Cover kind={m.art} img={m.img} className="reel__cover" />
                <span className="reel__text">
                  <span className="reel__title">{m.short}</span>
                  <span className="reel__pct">
                    {m.outcomes.length === 1 ? `${m.outcomes[0].pct}% Yes` : `${m.outcomes[0].name.split(' ').slice(-1)[0]} ${m.outcomes[0].pct}%`}
                  </span>
                </span>
                {active && (
                  <span className="reel__progress" aria-hidden>
                    <span
                      key={slide}
                      style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                      onAnimationEnd={() => go(fi + 1)}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="reel__nav">
          <button type="button" className="stage__icon stage__icon--lg" onClick={() => go(fi - 1)} aria-label="Previous market">
            <ChevronLeft />
          </button>
          <button type="button" className="stage__icon stage__icon--lg" onClick={() => go(fi + 1)} aria-label="Next market">
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
