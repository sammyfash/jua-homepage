/**
 * Odometer-style number: each digit is a vertical strip that rolls to its new value.
 * Non-digit characters (%, commas, currency) render as-is.
 */
export function RollingNumber({ value, className = '' }: { value: string; className?: string }) {
  const chars = [...value];
  return (
    <span className={`roll ${className}`} aria-label={value} role="text">
      {chars.map((c, i) => {
        // Key from the right so units stay put when the number gains a digit.
        const key = chars.length - i;
        if (!/\d/.test(c)) {
          return (
            <span key={`s${key}`} className="roll__sym" aria-hidden>
              {c}
            </span>
          );
        }
        return (
          <span key={`d${key}`} className="roll__digit" aria-hidden>
            {/* Invisible copy of the current digit sizes the slot, so a "1" is as narrow as it should be. */}
            <span className="roll__size">{c}</span>
            <span className="roll__strip" style={{ transform: `translateY(${-Number(c) * 10}%)` }}>
              {'0123456789'.split('').map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
