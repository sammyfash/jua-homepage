import { useMemo, useState } from 'react';
import { Avatar, Cover, MarketArt } from '../art';
import { simulateHistory } from '../chart';
import { FAQ, HOT_TOPICS, SERIES_COLORS, type Market } from '../data';
import type { Formatters } from '../format';
import { Sparkline } from './Chart';
import { ArrowRight, BookmarkIcon, BoltIcon, CoinsIcon, DepositIcon, Logo, MarketsIcon, MoreIcon, PlusIcon, PortfolioIcon, ShieldIcon } from './icons';

/* ---------------- How it works ---------------- */

const STEPS = [
  {
    n: 1,
    title: 'Pick a question',
    body: 'Elections, football, crypto, tech. Choose something you know about.',
    art: (
      <svg viewBox="0 0 220 120" className="step-art step-art--pick" aria-hidden>
        <g className="sa-card sa-card--1"><rect x="34" y="24" width="120" height="44" rx="10" /><circle cx="54" cy="46" r="10" className="sa-flag-ng" /><rect x="72" y="38" width="64" height="6" rx="3" /><rect x="72" y="50" width="40" height="6" rx="3" className="sa-soft" /></g>
        <g className="sa-card sa-card--2"><rect x="54" y="54" width="120" height="44" rx="10" /><circle cx="74" cy="76" r="10" className="sa-flag-ke" /><rect x="92" y="68" width="64" height="6" rx="3" /><rect x="92" y="80" width="40" height="6" rx="3" className="sa-soft" /></g>
        <g className="sa-cursor"><path d="M150 84l0 22 6-6 5 10 5-2-5-10 8-1z" /></g>
      </svg>
    ),
  },
  {
    n: 2,
    title: 'Choose Yes or No',
    body: 'The price is the chance. Yes at 54¢ means people think it is 54% likely.',
    art: (
      <svg viewBox="0 0 220 120" className="step-art step-art--choose" aria-hidden>
        <rect x="30" y="34" width="76" height="52" rx="14" className="sa-yes" />
        <text x="68" y="58" textAnchor="middle" className="sa-yes-t">Yes</text>
        <text x="68" y="76" textAnchor="middle" className="sa-yes-p">54¢</text>
        <rect x="114" y="34" width="76" height="52" rx="14" className="sa-no" />
        <text x="152" y="58" textAnchor="middle" className="sa-no-t">No</text>
        <text x="152" y="76" textAnchor="middle" className="sa-no-p">46¢</text>
        <rect x="26" y="30" width="84" height="60" rx="17" className="sa-ring" />
      </svg>
    ),
  },
  {
    n: 3,
    title: 'Get paid if you are right',
    body: 'Each correct share pays KSh 130. Or sell early any time to lock in a profit.',
    art: (
      <svg viewBox="0 0 220 120" className="step-art step-art--paid" aria-hidden>
        <rect x="50" y="70" width="120" height="34" rx="10" className="sa-wallet" />
        <rect x="164" y="80" width="12" height="14" rx="4" className="sa-wallet-tab" />
        <g className="sa-coin sa-coin--1"><circle cx="86" cy="44" r="14" /><text x="86" y="49" textAnchor="middle">K</text></g>
        <g className="sa-coin sa-coin--2"><circle cx="112" cy="30" r="14" /><text x="112" y="35" textAnchor="middle">K</text></g>
        <g className="sa-coin sa-coin--3"><circle cx="138" cy="46" r="14" /><text x="138" y="51" textAnchor="middle">K</text></g>
        <text x="110" y="92" textAnchor="middle" className="sa-amount">+ KSh 185</text>
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="how" id="how-it-works" aria-labelledby="how-title">
      <div className="section-head">
        <div>
          <div className="eyebrow">New to prediction markets?</div>
          <h2 id="how-title" className="section-title">The whole idea in three steps</h2>
        </div>
        <p className="section-lede">No charts to learn and no jargon. If you have an opinion about what happens next, you already know how to use Jua.</p>
      </div>
      <ol className="how__steps">
        {STEPS.map((s) => (
          <li key={s.n} className="step">
            <div className="step__art">{s.art}</div>
            <div className="step__n">Step {s.n}</div>
            <h3 className="step__title">{s.title}</h3>
            <p className="step__body">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="how__trust">
        <span><ShieldIcon size={18} /> Results from official sources</span>
        <span><BoltIcon size={18} /> Sell any time before the close</span>
        <span><CoinsIcon size={18} /> Start from KSh 1, priced in KES or USDC</span>
      </div>
    </section>
  );
}

/* ---------------- Market card ---------------- */

function Ring({ pct }: { pct: number }) {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <span className="ring">
      <svg viewBox="0 0 56 56" aria-hidden>
        <circle cx="28" cy="28" r={r} className="ring__track" />
        <circle cx="28" cy="28" r={r} className="ring__fill" style={{ strokeDasharray: c, ['--off' as string]: c * (1 - pct / 100), ['--full' as string]: c }} />
      </svg>
      <span className="ring__val">
        {pct}
        <small>%</small>
      </span>
    </span>
  );
}

type CardProps = { m: Market; fmt: Formatters; saved: boolean; onToggleSave: () => void; index: number };

export function MarketCard({ m, fmt, saved, onToggleSave, index }: CardProps) {
  const bin = m.outcomes.length === 1;
  const hidden = (m.extra ?? 0) + Math.max(0, m.outcomes.length - 2);
  const hist = useMemo(() => simulateHistory(m.outcomes[0].pct, index * 17 + 3), [m, index]);
  const up = hist[hist.length - 1] >= hist[0];
  const yesPays = (fmt.exampleStake * 100) / m.outcomes[0].pct;
  return (
    <article className="mcard" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <div className="mcard__media">
        <Cover kind={m.art} img={m.img} className="mcard__cover" />
        <span className="mcard__cat">{m.cat}</span>
        <button type="button" className="mcard__save" onClick={onToggleSave} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save market'}>
          <BookmarkIcon size={12} filled={saved} />
        </button>
      </div>
      <div className="mcard__body">
        <a href="#" className="mcard__title">
          {m.title}
        </a>
        {bin ? (
          <>
            <div className="mcard__binary">
              <Ring pct={m.outcomes[0].pct} />
              <div className="mcard__trend">
                <Sparkline vals={hist} color={up ? 'var(--yesFg)' : 'var(--noFg)'} up={up} />
                <span className="muted-11">chance of Yes</span>
              </div>
            </div>
            <div className="yn">
              <a href="#" className="yes">
                Yes <span className="yn__price">{fmt.price(m.outcomes[0].pct)}</span>
              </a>
              <a href="#" className="no">
                No <span className="yn__price">{fmt.price(100 - m.outcomes[0].pct)}</span>
              </a>
            </div>
            <div className="mcard__explain">
              {fmt.cash(fmt.exampleStake)} on Yes pays <b>{fmt.cash(yesPays)}</b> if it happens
            </div>
          </>
        ) : (
          <div className="mcard__multi">
            {m.outcomes.slice(0, 2).map((o, i) => (
              <div className="mcard__orow" key={o.name}>
                <Avatar name={o.name} size={28} tone={i} />
                <span className="mcard__ocol">
                  <span className="mcard__otop">
                    <span className="ellipsis mcard__oname">{o.name}</span>
                    <span className="mcard__opct">{o.pct}%</span>
                  </span>
                  <span className="mcard__obar">
                    <span style={{ width: `${o.pct}%`, background: SERIES_COLORS[i] }} />
                  </span>
                </span>
                <a href="#" className="mcard__obuy yes">Yes</a>
              </div>
            ))}
            <div className="muted-11">{hidden ? `+${hidden} more outcomes` : 'All outcomes shown'}</div>
          </div>
        )}
        <div className="mcard__foot">
          <span>{fmt.vol(m.vol)} traded</span>
          <span>Closes in {m.closes}</span>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Hot topics ---------------- */

export function HotTopics({ fmt, onPick }: { fmt: Formatters; onPick: (name: string) => void }) {
  return (
    <section className="topics" aria-labelledby="topics-title">
      <div className="section-head section-head--row">
        <h2 id="topics-title" className="section-title">Hot topics</h2>
        <span className="eyebrow">By lifetime volume</span>
      </div>
      <div className="topics__row">
        {HOT_TOPICS.map(([name, kes, art], i) => (
          <button type="button" key={name} className="topic" onClick={() => onPick(name)}>
            <MarketArt kind={art} className="topic__art" />
            <span className="topic__shade" />
            <span className="topic__rank">#{i + 1}</span>
            <span className="topic__text">
              <span className="topic__name">{name}</span>
              <span className="topic__vol">{fmt.vol(kes)} traded</span>
            </span>
            <span className="topic__go" aria-hidden>
              <ArrowRight size={14} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="faq__intro">
        <div className="eyebrow">Good questions</div>
        <h2 id="faq-title" className="section-title">Everything people ask before their first trade</h2>
        <p className="section-lede">Still unsure? Start with the free KSh 50.00 credit and learn with real markets, without risking your own money.</p>
        <a href="#" className="btn-primary faq__cta">
          Claim free credit
        </a>
      </div>
      <div className="faq__list">
        {FAQ.map(([q, a], i) => (
          <div key={q} className={`faq__item${open === i ? ' is-open' : ''}`}>
            <h3>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {q}
                <span className="faq__plus" aria-hidden>
                  <PlusIcon />
                </span>
              </button>
            </h3>
            <div className="faq__a">
              <p>{a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Footer & tab bar ---------------- */

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <div className="footer__brand">
          <Logo height={26} />
          <p>African prediction markets. Buy and sell shares on what happens next, priced in USDC with KES as your local reference.</p>
          <div className="footer__social">
            <a href="#">X / Twitter</a>
            <a href="#">Discord</a>
            <a href="#">GitHub</a>
            <a href="mailto:hello@jua.app">hello@jua.app</a>
          </div>
        </div>
        <div className="footer__col">
          <div className="footer__h">Product</div>
          <a href="#">Markets</a>
          <a href="#">Portfolio</a>
          <a href="#">Fund account</a>
        </div>
        <div className="footer__col">
          <div className="footer__h">Company</div>
          <a href="#">About Jua</a>
          <a href="#how-it-works">How it works</a>
          <a href="#">Support</a>
        </div>
        <div className="footer__col">
          <div className="footer__h">Legal</div>
          <a href="#">Privacy policy</a>
          <a href="#">Terms of use</a>
          <a href="#">Responsible trading</a>
        </div>
      </div>
      <div className="footer__legal">
        Candidate photos from Wikimedia Commons; hover a photo for its credit and licence. © 2026 Jua Labs. All rights reserved. Trading on Jua involves risk. Past performance is not indicative of future results. Jua is not a broker-dealer or financial advisor. USDC is used for settlement; KES values are shown for reference only.
      </div>
    </footer>
  );
}

export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Primary">
      <a href="#" className="tabbar__item" aria-current="page">
        <MarketsIcon />
        Markets
      </a>
      <a href="#" className="tabbar__item">
        <PortfolioIcon />
        Portfolio
      </a>
      <a href="#" className="tabbar__item tabbar__item--fab">
        <span className="tabbar__fab">
          <DepositIcon />
        </span>
        Deposit
      </a>
      <a href="#" className="tabbar__item">
        <MoreIcon />
        More
      </a>
    </nav>
  );
}
