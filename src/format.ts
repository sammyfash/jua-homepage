export type Currency = 'KES' | 'USDC';

/** KES per USDC. */
export const RATE = 130;

export function makeFormatters(cur: Currency) {
  const usd = cur === 'USDC';
  /** Share price for an outcome trading at `pct`%. */
  const price = (pct: number) => (usd ? `${pct}¢` : `KSh ${Math.round((pct / 100) * RATE)}`);
  /** Compact volume, given in KES. */
  const vol = (kes: number) => {
    const v = usd ? kes / RATE : kes;
    const s = v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(1) + 'k' : String(Math.round(v));
    return (usd ? '$' : 'KSh ') + s;
  };
  /** Amount in the active currency's own units (KSh or $). */
  const cash = (v: number) => (usd ? `$${v.toFixed(2)}` : `KSh ${Math.round(v).toLocaleString('en-KE')}`);
  /** A round example stake: KSh 100 or $1. */
  const exampleStake = usd ? 1 : 100;
  return { price, vol, cash, exampleStake };
}

export type Formatters = ReturnType<typeof makeFormatters>;
