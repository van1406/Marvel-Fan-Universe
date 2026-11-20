import "../styles/DayNightToggle.css";

/* Decorative stars that appear inside the track at night */
const STARS = [
  { left: "17%", top: "22%", delay: "0s" },
  { left: "33%", top: "45%", delay: "-0.8s" },
  { left: "46%", top: "17%", delay: "-1.6s" },
  { left: "57%", top: "40%", delay: "-2.2s" },
  { left: "70%", top: "20%", delay: "-1.1s" },
  { left: "85%", top: "43%", delay: "-2.7s" },
  { left: "26%", top: "58%", delay: "-1.9s" },
  { left: "64%", top: "60%", delay: "-0.4s" },
];

export default function DayNightToggle({ mode, onToggle }) {
  const isNight = mode === "night";

  return (
    <button
      type="button"
      className={`dnt ${isNight ? "dnt--night" : "dnt--day"}`}
      onClick={onToggle}
      aria-pressed={isNight}
      aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
      title={isNight ? "Night mode — click for day mode" : "Day mode — click for night mode"}
    >
      {/* Sky track */}
      <span className="dnt__track">
        {/* Night stars */}
        <span className="dnt__stars" aria-hidden="true">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="dnt__star"
              style={{ left: s.left, top: s.top, animationDelay: s.delay }}
            />
          ))}
        </span>

        {/* Moon (night) */}
        <span className="dnt__moon" aria-hidden="true">🌙</span>

        {/* Sun (day) */}
        <span className="dnt__sun" aria-hidden="true" />

        {/* Moving clouds — the provided cloud images */}
        <span className="dnt__clouds" aria-hidden="true">
          <span className="dnt__cloud-track">
            <img src="/cloud.png" alt="" draggable="false" />
            <img src="/cloud2.png" alt="" draggable="false" />
            <img src="/cloud.png" alt="" draggable="false" />
            <img src="/cloud2.png" alt="" draggable="false" />
          </span>
        </span>
      </span>

      {/* Knob */}
      <span className="dnt__knob" aria-hidden="true" />
    </button>
  );
}
