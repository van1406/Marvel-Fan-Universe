import { Fragment, useEffect, useState } from "react";

/* ─────────────────────────────────────
   Avengers: Doomsday — December 18, 2026 (local time)
   ───────────────────────────────────── */
const TARGET = new Date(2026, 11, 18, 0, 0, 0, 0);

const UNITS = [
  { key: "months", label: "Months", pad: true },
  { key: "days", label: "Days", pad: true },
  { key: "hours", label: "Hours", pad: true },
  { key: "minutes", label: "Minutes", pad: true },
  { key: "seconds", label: "Seconds", pad: true },
];

/* Add months safely — clamps the day so Jan 31 → Feb 28/29
   and Feb 29 → Feb 28 instead of rolling into the next month. */
function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, daysInMonth));
  return d;
}

/* Split the remaining time into calendar months + d/h/m/s (no years) */
function getTimeLeft() {
  const now = new Date();
  if (now >= TARGET) return null;

  let cursor = new Date(now);

  let months = 0;
  while (months < 11) {
    const next = addMonths(cursor, 1);
    if (next > TARGET) break;
    cursor = next;
    months++;
  }

  let rem = TARGET - cursor;
  const days = Math.floor(rem / 86400000);
  rem -= days * 86400000;
  const hours = Math.floor(rem / 3600000);
  rem -= hours * 3600000;
  const minutes = Math.floor(rem / 60000);
  rem -= minutes * 60000;
  const seconds = Math.floor(rem / 1000);

  return { months, days, hours, minutes, seconds };
}

const pad2 = (v) => String(v).padStart(2, "0");

/* ─── Main Component ─── */
export default function DoomsdayCountdown({ onBack }) {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ddc">
      {/* full-screen Doctor Doom background */}
      <div className="ddc-bg" aria-hidden="true">
        <img src="/doomsday_img.jpg" alt="" />
      </div>
      <div className="ddc-overlay" aria-hidden="true" />

      {/* top nav */}
      <nav className="ddc-topnav">
        <div className="ddc-topnav__inner">
          <button className="ddc-back" onClick={onBack} aria-label="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </button>
        </div>
      </nav>

      {/* main */}
      <main className="ddc-main">
        <div className="ddc-badge">PHASE 6 · THE END BEGINS</div>

        <h1 className="ddc-title">
          <span className="ddc-title__kicker">Avengers:</span>
          <span className="ddc-title__main">Doomsday</span>
        </h1>

        <p className="ddc-subtitle">
          All variants. All timelines. One doom. When the clock hits zero,
          the multiverse kneels to Doctor Doom.
        </p>

        {time ? (
          <div className="ddc-countdown-wrap">
            <div
              className="ddc-countdown"
              role="timer"
              aria-label="Countdown to Avengers: Doomsday"
            >
              {UNITS.map((u, i) => (
                <Fragment key={u.key}>
                  {i > 0 && (
                    <span className="ddc-sep" aria-hidden="true">|</span>
                  )}
                  <div className="ddc-unit">
                    <span
                      className={`ddc-unit__num${
                        u.key === "seconds" ? " ddc-unit__num--sec" : ""
                      }`}
                    >
                      {u.pad ? pad2(time[u.key]) : time[u.key]}
                    </span>
                    <span className="ddc-unit__label">{u.label}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="ddc-arrived" role="status">
            ☠ It&apos;s Doomsday
          </div>
        )}

        <div className="ddc-date">
          <span className="ddc-date__line" />
          <span className="ddc-date__text">In Theaters · December 18, 2026</span>
          <span className="ddc-date__line" />
        </div>
      </main>

      {/* footer */}
      <footer className="ddc-footer">
        <div className="ddc-footer__inner">
          <button className="ddc-footer__back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <p className="ddc-footer__credit">
            Marvel and all related characters © Marvel Entertainment
          </p>
        </div>
      </footer>
    </div>
  );
}
