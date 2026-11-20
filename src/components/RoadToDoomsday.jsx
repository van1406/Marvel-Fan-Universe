import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────
   TIMELINE DATA — All MCU titles leading to Doomsday
   ───────────────────────────────────── */
const TIMELINE_ITEMS = [
  { id: "im1", title: "Iron Man", year: 2008, type: "movie", hero: "Tony Stark / Iron Man", female: "Pepper Potts", villain: "Obadiah Stane / Iron Monger", director: "Jon Favreau", producer: "Kevin Feige", date: "May 2, 2008", watch: "JioHotstar", phase: "Phase 1" },
  { id: "ih1", title: "The Incredible Hulk", year: 2008, type: "movie", hero: "Bruce Banner / Hulk", female: "Betty Ross", villain: "Abomination (Emil Blonsky)", director: "Louis Leterrier", producer: "Kevin Feige", date: "June 13, 2008", watch: "JioHotstar, VI movies and tv", phase: "Phase 1" },
  { id: "im2", title: "Iron Man 2", year: 2010, type: "movie", hero: "Tony Stark / Iron Man", female: "Pepper Potts", villain: "Ivan Vanko / Whiplash", director: "Jon Favreau", producer: "Kevin Feige", date: "May 7, 2010", watch: "JioHotstar", phase: "Phase 1" },
  { id: "th1", title: "Thor", year: 2011, type: "movie", hero: "Thor", female: "Jane Foster", villain: "Loki", director: "Kenneth Branagh", producer: "Kevin Feige", date: "May 6, 2011", watch: "JioHotstar, VI movies and tv", phase: "Phase 1" },
  { id: "ca1", title: "Captain America: The First Avenger", year: 2011, type: "movie", hero: "Steve Rogers / Captain America", female: "Peggy Carter", villain: "Red Skull (Johann Schmidt)", director: "Joe Johnston", producer: "Kevin Feige", date: "July 22, 2011", watch: "JioHotstar", phase: "Phase 1" },
  { id: "av1", title: "The Avengers", year: 2012, type: "movie", hero: "The Avengers Team", female: "Black Widow (Natasha Romanoff)", villain: "Loki", director: "Joss Whedon", producer: "Kevin Feige", date: "May 4, 2012", watch: "JioHotstar, VI movies and tv", phase: "Phase 1" },
  { id: "im3", title: "Iron Man 3", year: 2013, type: "movie", hero: "Tony Stark / Iron Man", female: "Pepper Potts", villain: "Aldrich Killian / The Mandarin", director: "Shane Black", producer: "Kevin Feige", date: "May 3, 2013", watch: "JioHotstar, VI movies and tv", phase: "Phase 2" },
  { id: "thd", title: "Thor: The Dark World", year: 2013, type: "movie", hero: "Thor", female: "Jane Foster", villain: "Malekith the Accursed", director: "Alan Taylor", producer: "Kevin Feige", date: "November 8, 2013", watch: "JioHotstar, VI movies and tv", phase: "Phase 2" },
  { id: "caa", title: "Captain America: The Winter Soldier", year: 2014, type: "movie", hero: "Steve Rogers / Captain America", female: "Black Widow (Natasha Romanoff)", villain: "Winter Soldier (Bucky Barnes) / HYDRA", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "April 4, 2014", watch: "JioHotstar", phase: "Phase 2" },
  { id: "gotg1", title: "Guardians of the Galaxy", year: 2014, type: "movie", hero: "Peter Quill / Star-Lord", female: "Gamora", villain: "Ronan the Accuser", director: "James Gunn", producer: "Kevin Feige", date: "August 1, 2014", watch: "JioHotstar", phase: "Phase 2" },
  { id: "aou", title: "Avengers: Age of Ultron", year: 2015, type: "movie", hero: "The Avengers Team", female: "Scarlet Witch (Wanda Maximoff)", villain: "Ultron", director: "Joss Whedon", producer: "Kevin Feige", date: "May 1, 2015", watch: "JioHotstar, VI movies and tv", phase: "Phase 2" },
  { id: "am1", title: "Ant-Man", year: 2015, type: "movie", hero: "Scott Lang / Ant-Man", female: "Hope van Dyne", villain: "Darren Cross / Yellowjacket", director: "Peyton Reed", producer: "Kevin Feige", date: "July 17, 2015", watch: "JioHotstar", phase: "Phase 2" },
  { id: "cacw", title: "Captain America: Civil War", year: 2016, type: "movie", hero: "Steve Rogers / Captain America", female: "Black Widow (Natasha Romanoff)", villain: "Helmut Zemo", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "May 6, 2016", watch: "JioHotstar", phase: "Phase 3" },
  { id: "dstr", title: "Doctor Strange", year: 2016, type: "movie", hero: "Stephen Strange / Doctor Strange", female: "Christine Palmer", villain: "Dormammu / Kaecilius", director: "Scott Derrickson", producer: "Kevin Feige", date: "November 4, 2016", watch: "JioHotstar", phase: "Phase 3" },
  { id: "gotg2", title: "Guardians of the Galaxy Vol. 2", year: 2017, type: "movie", hero: "Peter Quill / Star-Lord", female: "Gamora", villain: "Ego the Living Planet", director: "James Gunn", producer: "Kevin Feige", date: "May 5, 2017", watch: "JioHotstar", phase: "Phase 3" },
  { id: "smh", title: "Spider-Man: Homecoming", year: 2017, type: "movie", hero: "Peter Parker / Spider-Man", female: "Liz Allan", villain: "Adrian Toomes / Vulture", director: "Jon Watts", producer: "Kevin Feige & Amy Pascal", date: "July 7, 2017", watch: "Netflix, Amazon Prime Video, JioHotstar, VI movies and tv", phase: "Phase 3" },
  { id: "thrr", title: "Thor: Ragnarok", year: 2017, type: "movie", hero: "Thor", female: "Valkyrie", villain: "Hela", director: "Taika Waititi", producer: "Kevin Feige", date: "November 3, 2017", watch: "JioHotstar", phase: "Phase 3" },
  { id: "bp1", title: "Black Panther", year: 2018, type: "movie", hero: "T'Challa / Black Panther", female: "Okoye / Shuri", villain: "Erik Killmonger", director: "Ryan Coogler", producer: "Kevin Feige", date: "February 16, 2018", watch: "JioHotstar, VI movies and tv", phase: "Phase 3" },
  { id: "amtw", title: "Ant-Man and the Wasp", year: 2018, type: "movie", hero: "Scott Lang / Ant-Man", female: "Hope van Dyne / Wasp", villain: "Ghost (Ava Starr)", director: "Peyton Reed", producer: "Kevin Feige", date: "July 6, 2018", watch: "JioHotstar, VI movies and tv", phase: "Phase 3" },
  { id: "aiw", title: "Avengers: Infinity War", year: 2018, type: "movie", hero: "The Avengers & Guardians", female: "Gamora / Scarlet Witch", villain: "Thanos", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "April 27, 2018", watch: "JioHotstar, VI movies and tv", phase: "Phase 3" },
  { id: "aeg", title: "Avengers: Endgame", year: 2019, type: "movie", hero: "The Avengers Team", female: "Black Widow / Captain Marvel", villain: "Thanos", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "April 26, 2019", watch: "JioHotstar, VI movies and tv", phase: "Phase 3" },
  { id: "smffh", title: "Spider-Man: Far From Home", year: 2019, type: "movie", hero: "Peter Parker / Spider-Man", female: "MJ (Michelle Jones)", villain: "Mysterio (Quentin Beck)", director: "Jon Watts", producer: "Kevin Feige & Amy Pascal", date: "July 2, 2019", watch: "Netflix, Amazon Prime Video, JioHotstar, Sony LIV, VI movies and tv", phase: "Phase 3" },
  { id: "bw", title: "Black Widow", year: 2021, type: "movie", hero: "Natasha Romanoff / Black Widow", female: "Yelena Belova", villain: "Taskmaster (Antonia Dreykov)", director: "Cate Shortland", producer: "Kevin Feige", date: "July 9, 2021", watch: "JioHotstar", phase: "Phase 4" },
  { id: "sc", title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, type: "movie", hero: "Shang-Chi", female: "Katy Chen", villain: "Wenwu / The Mandarin", director: "Destin Daniel Cretton", producer: "Kevin Feige", date: "September 3, 2021", watch: "JioHotstar", phase: "Phase 4" },
  { id: "et", title: "Eternals", year: 2021, type: "movie", hero: "The Eternals", female: "Sersi", villain: "Arishem / Kro", director: "Chloé Zhao", producer: "Kevin Feige", date: "November 5, 2021", watch: "JioHotstar, VI movies and tv", phase: "Phase 4" },
  { id: "smnwh", title: "Spider-Man: No Way Home", year: 2021, type: "movie", hero: "Peter Parker / Spider-Man", female: "MJ (Michelle Jones)", villain: "Green Goblin / Electro / Doc Ock", director: "Jon Watts", producer: "Kevin Feige & Amy Pascal", date: "December 17, 2021", watch: "JioHotstar, Sony LIV", phase: "Phase 4" },
  { id: "dsmom", title: "Doctor Strange in the Multiverse of Madness", year: 2022, type: "movie", hero: "Stephen Strange / Doctor Strange", female: "America Chavez", villain: "Scarlet Witch (Wanda Maximoff)", director: "Sam Raimi", producer: "Kevin Feige", date: "May 6, 2022", watch: "JioHotstar, VI movies and tv", phase: "Phase 4" },
  { id: "tlk", title: "Thor: Love and Thunder", year: 2022, type: "movie", hero: "Thor", female: "Jane Foster / Mighty Thor", villain: "Gorr the God Butcher", director: "Taika Waititi", producer: "Kevin Feige", date: "July 8, 2022", watch: "JioHotstar", phase: "Phase 4" },
  { id: "bpwf", title: "Black Panther: Wakanda Forever", year: 2022, type: "movie", hero: "Shuri / Black Panther", female: "Okoye / Riri Williams", villain: "Namor", director: "Ryan Coogler", producer: "Kevin Feige", date: "November 11, 2022", watch: "JioHotstar, VI movies and tv", phase: "Phase 4" },
  { id: "amtq", title: "Ant-Man and the Wasp: Quantumania", year: 2023, type: "movie", hero: "Scott Lang / Ant-Man", female: "Hope van Dyne / Wasp", villain: "Kang the Conqueror", director: "Peyton Reed", producer: "Kevin Feige", date: "February 17, 2023", watch: "JioHotstar", phase: "Phase 5" },
  { id: "gotg3", title: "Guardians of the Galaxy Vol. 3", year: 2023, type: "movie", hero: "Peter Quill / Star-Lord", female: "Gamora", villain: "High Evolutionary", director: "James Gunn", producer: "Kevin Feige", date: "May 5, 2023", watch: "VI movies and tv", phase: "Phase 5" },
  { id: "capm", title: "The Marvels", year: 2023, type: "movie", hero: "Carol Danvers / Captain Marvel", female: "Kamala Khan & Monica Rambeau", villain: "Dar-Benn", director: "Nia DaCosta", producer: "Kevin Feige", date: "November 10, 2023", watch: "VI movies and tv", phase: "Phase 5" },
  { id: "d&w", title: "Deadpool & Wolverine", year: 2024, type: "movie", hero: "Deadpool & Wolverine", female: "Cassandra Nova / B-15", villain: "Cassandra Nova", director: "Shawn Levy", producer: "Kevin Feige", date: "July 26, 2024", watch: "JioHotstar", phase: "Phase 5" },
  { id: "cmns", title: "Captain America: Brave New World", year: 2025, type: "movie", hero: "Sam Wilson / Captain America", female: "Ruth Bat-Seraph", villain: "The Leader (Samuel Sterns)", director: "Julius Onah", producer: "Kevin Feige", date: "February 14, 2025", watch: "Not streaming yet", phase: "Phase 5" },
  { id: "thunderbolts", title: "Thunderbolts*", year: 2025, type: "movie", hero: "The Thunderbolts", female: "Yelena Belova", villain: "Sentry / Valentina Allegra de Fontaine", director: "Jake Schreier", producer: "Kevin Feige", date: "May 2, 2025", watch: "JioHotstar", phase: "Phase 5" },
  { id: "ff", title: "The Fantastic Four: First Steps", year: 2025, type: "movie", hero: "The Fantastic Four", female: "Invisible Woman (Sue Storm)", villain: "Galactus / Silver Surfer", director: "Matt Shakman", producer: "Kevin Feige", date: "July 25, 2025", watch: "JioHotstar", phase: "Phase 6" },
];

const DOOMSDAY_ITEM = {
  id: "doom",
  title: "Avengers: Doomsday",
  year: 2026,
  type: "movie",
  hero: "The Avengers & X-Men",
  female: "Wanda / Jean Grey",
  villain: "Doctor Doom",
  director: "Anthony & Joe Russo",
  producer: "Kevin Feige",
  date: "May 1, 2026",
  watch: "Not streaming yet",
  phase: "Phase 6",
};

/* Total nodes = movies + 1 Doomsday */
const TOTAL_NODES = TIMELINE_ITEMS.length + 1;
const NODE_SPACING = 220;
const NODE_START_X = 100;

/* ─── custom hook: IntersectionObserver ─── */
function useInView(ref, opts = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, ...opts }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

/* ─── Timeline Card ─── */
function TimelineCard({ item, index, onClick, isExpanded, isActive }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  const isAbove = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`rttd-card ${vis ? "rttd-card--vis" : ""} ${isAbove ? "rttd-card--above" : "rttd-card--below"} ${isExpanded ? "rttd-card--expanded" : ""} ${isActive ? "rttd-card--active" : ""}`}
      style={{ animationDelay: `${(index % 12) * 0.06}s` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="rttd-card__accent" />
      <div className="rttd-card__head">
        <span className="rttd-card__phase">{item.phase}</span>
        <span className="rttd-card__year">{item.year}</span>
      </div>
      <h3 className="rttd-card__title">{item.title}</h3>
      <p className="rttd-card__date">{item.date}</p>

      <div className="rttd-card__quick">
        <div className="rttd-card__qi">
          <span className="rttd-card__qi-label">🦸 Hero</span>
          <span className="rttd-card__qi-value">{item.hero}</span>
        </div>
        <div className="rttd-card__qi">
          <span className="rttd-card__qi-label">⚔️ Villain</span>
          <span className="rttd-card__qi-value">{item.villain}</span>
        </div>
      </div>

      <div className="rttd-card__arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className="rttd-card__detail">
        <div className="rttd-card__detail-grid">
          <div className="rttd-card__di">
            <span className="rttd-card__di-label">👩 Lead Female</span>
            <span className="rttd-card__di-value">{item.female}</span>
          </div>
          <div className="rttd-card__di">
            <span className="rttd-card__di-label">🎥 Director</span>
            <span className="rttd-card__di-value">{item.director}</span>
          </div>
          <div className="rttd-card__di">
            <span className="rttd-card__di-label">🎞️ Producer</span>
            <span className="rttd-card__di-value">{item.producer}</span>
          </div>
          <div className="rttd-card__di">
            <span className="rttd-card__di-label">📅 Release Date</span>
            <span className="rttd-card__di-value">{item.date}</span>
          </div>
          <div className="rttd-card__di rttd-card__di--full">
            <span className="rttd-card__di-label">📺 Where to Watch</span>
            <span className="rttd-card__di-value rttd-card__di-value--highlight">{item.watch}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Doomsday Node ─── */
function DoomsdayNode({ onClick, isExpanded, isActive }) {
  const ref = useRef(null);
  const vis = useInView(ref);

  return (
    <div
      ref={ref}
      className={`rttd-doomsday ${vis ? "rttd-doomsday--vis" : ""} ${isActive ? "rttd-doomsday--active" : ""}`}
    >
      <div className="rttd-doomsday__node" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}>
        <div className="rttd-doomsday__glow" />
        <div className="rttd-doomsday__core">
          <span className="rttd-doomsday__icon">☠️</span>
        </div>
      </div>

      <div className={`rttd-doomsday__card ${isExpanded ? "rttd-doomsday__card--expanded" : ""}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}>
        <div className="rttd-doomsday__card-accent" />
        <div className="rttd-doomsday__card-head">
          <span className="rttd-doomsday__card-badge">⚡ FINALE</span>
          <span className="rttd-doomsday__card-year">{DOOMSDAY_ITEM.year}</span>
        </div>
        <h2 className="rttd-doomsday__card-title">Avengers: Doomsday</h2>
        <p className="rttd-doomsday__card-date">{DOOMSDAY_ITEM.date}</p>

        <div className="rttd-doomsday__card-info">
          <div className="rttd-doomsday__card-qi">
            <span className="rttd-doomsday__card-qi-label">🦸 Hero</span>
            <span className="rttd-doomsday__card-qi-value">{DOOMSDAY_ITEM.hero}</span>
          </div>
          <div className="rttd-doomsday__card-qi">
            <span className="rttd-doomsday__card-qi-label">⚔️ Villain</span>
            <span className="rttd-doomsday__card-qi-value">{DOOMSDAY_ITEM.villain}</span>
          </div>
        </div>

        <div className="rttd-doomsday__card-detail">
          <div className="rttd-card__detail-grid">
            <div className="rttd-card__di">
              <span className="rttd-card__di-label">👩 Lead Female</span>
              <span className="rttd-card__di-value">{DOOMSDAY_ITEM.female}</span>
            </div>
            <div className="rttd-card__di">
              <span className="rttd-card__di-label">🎥 Director</span>
              <span className="rttd-card__di-value">{DOOMSDAY_ITEM.director}</span>
            </div>
            <div className="rttd-card__di">
              <span className="rttd-card__di-label">🎞️ Producer</span>
              <span className="rttd-card__di-value">{DOOMSDAY_ITEM.producer}</span>
            </div>
            <div className="rttd-card__di">
              <span className="rttd-card__di-label">📅 Release Date</span>
              <span className="rttd-card__di-value">{DOOMSDAY_ITEM.date}</span>
            </div>
            <div className="rttd-card__di rttd-card__di--full">
              <span className="rttd-card__di-label">📺 Where to Watch</span>
              <span className="rttd-card__di-value rttd-card__di-value--highlight">{DOOMSDAY_ITEM.watch}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function RoadToDoomsday({ onBack }) {
  const heroRef = useRef(null);
  const heroVis = useInView(heroRef);
  const scrollRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPulse, setShowPulse] = useState(true);

  /* Fade pulse animation after initial load */
  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  /* Navigate to a specific node index (0 = first movie, TOTAL_NODES-1 = Doomsday) */
  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(0, Math.min(index, TOTAL_NODES - 1));
    setActiveIndex(clamped);

    /* Calculate the x position of the target node */
    let targetX;
    if (clamped < TIMELINE_ITEMS.length) {
      targetX = clamped * NODE_SPACING + NODE_START_X;
    } else {
      /* Doomsday node */
      targetX = TIMELINE_ITEMS.length * NODE_SPACING + NODE_START_X + 150;
    }

    /* Scroll so the target is centered in the wrapper */
    const wrapper = scrollRef.current;
    const wrapperWidth = wrapper.clientWidth;
    const scrollTarget = targetX - wrapperWidth / 2;

    wrapper.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
  }, []);

  const goNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  const goPrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  /* Track active index based on scroll position */
  useEffect(() => {
    const wrapper = scrollRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const scrollLeft = wrapper.scrollLeft;
      const wrapperWidth = wrapper.clientWidth;
      const center = scrollLeft + wrapperWidth / 2;

      /* Find the closest node to the center */
      let closestIdx = 0;
      let closestDist = Infinity;

      for (let i = 0; i < TOTAL_NODES; i++) {
        let nodeX;
        if (i < TIMELINE_ITEMS.length) {
          nodeX = i * NODE_SPACING + NODE_START_X;
        } else {
          nodeX = TIMELINE_ITEMS.length * NODE_SPACING + NODE_START_X + 150;
        }
        const dist = Math.abs(nodeX - center);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }

      setActiveIndex(closestIdx);
    };

    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, []);

  /* SVG dimensions */
  const totalWidth = TIMELINE_ITEMS.length * NODE_SPACING + NODE_START_X + 300;
  const svgHeight = 400;
  const lineY = svgHeight / 2;

  /* Straight line path */
  const linePath = `M 0 ${lineY} L ${totalWidth} ${lineY}`;

  /* Doomsday node x */
  const doomX = TIMELINE_ITEMS.length * NODE_SPACING + NODE_START_X + 150;

  return (
    <div className="rttd">
      {/* ambient bg */}
      <div className="rttd-bg" aria-hidden="true">
        <img src="/Marvel.webp" alt="" />
      </div>
      <div className="rttd-bg-dark" />

      {/* top nav */}
      <nav className="rttd-topnav">
        <div className="rttd-topnav__inner">
          <button className="rttd-back" onClick={onBack} aria-label="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </button>
        </div>
      </nav>

      {/* hero */}
      <section className="rttd-hero" ref={heroRef}>
        <div className="rttd-hero__bg">
          <div className="rttd-hero__overlay" />
          <div className="rttd-hero__grid" />
        </div>
        <div className={`rttd-hero__content ${heroVis ? "rttd-hero__content--vis" : ""}`}>
          <div className="rttd-hero__badge">PHASES 1 – 6</div>
          <h1 className="rttd-hero__title">
            <span className="rttd-hero__line1">Road to</span>
            <span className="rttd-hero__line2">Doomsday</span>
          </h1>
          <p className="rttd-hero__subtitle">
            Trace every pivotal MCU moment on the path to the event that changes everything.
            {TIMELINE_ITEMS.length} titles leading to Doctor Doom's arrival.
          </p>
          <div className="rttd-hero__scroll-hint">
            <span>Scroll to explore</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="rttd-timeline-section">
        {/* Progress counter */}
        <div className="rttd-progress">
          <span className="rttd-progress__current">{activeIndex + 1}</span>
          <span className="rttd-progress__sep">/</span>
          <span className="rttd-progress__total">{TOTAL_NODES}</span>
          <span className="rttd-progress__label">
            {activeIndex < TIMELINE_ITEMS.length
              ? TIMELINE_ITEMS[activeIndex].title
              : DOOMSDAY_ITEM.title}
          </span>
        </div>

        <div className="rttd-timeline-wrapper" ref={scrollRef}>
          <div className="rttd-timeline" style={{ width: totalWidth }}>

            {/* SVG straight glowing line */}
            <svg
              className="rttd-svg"
              viewBox={`0 0 ${totalWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                {/* NOTE: gradients/filters MUST use userSpaceOnUse here — a horizontal
                    line has a zero-height bounding box, and browsers render nothing
                    for objectBoundingBox gradients/filters on a degenerate bbox. */}
                <filter
                  id="glow"
                  filterUnits="userSpaceOnUse"
                  x="0"
                  y={lineY - 80}
                  width={totalWidth}
                  height={160}
                >
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient
                  id="lineGrad"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1={lineY}
                  x2={totalWidth}
                  y2={lineY}
                >
                  <stop offset="0%" stopColor="#e23636" stopOpacity="0.55" />
                  <stop offset="20%" stopColor="#e23636" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#ff4444" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#e23636" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ff2020" stopOpacity="1" />
                </linearGradient>
                <linearGradient
                  id="lineGradBlur"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1={lineY}
                  x2={totalWidth}
                  y2={lineY}
                >
                  <stop offset="0%" stopColor="#e23636" stopOpacity="0.12" />
                  <stop offset="20%" stopColor="#e23636" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#ff4444" stopOpacity="0.4" />
                  <stop offset="80%" stopColor="#e23636" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ff2020" stopOpacity="0.65" />
                </linearGradient>
              </defs>
              {/* glow layer */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGradBlur)"
                strokeWidth="14"
                filter="url(#glow)"
              />
              {/* solid base line — guarantees a continuous line even if
                  gradients ever fail to paint */}
              <path
                d={linePath}
                fill="none"
                stroke="#e23636"
                strokeOpacity="0.85"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* main gradient line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            {/* Timeline nodes and cards */}
            {TIMELINE_ITEMS.map((item, i) => {
              const x = i * NODE_SPACING + NODE_START_X;
              const isAbove = i % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`rttd-node ${isAbove ? "rttd-node--above" : "rttd-node--below"} ${activeIndex === i ? "rttd-node--active" : ""}`}
                  style={{ left: x, top: lineY }}
                >
                  {/* connector line */}
                  <div className="rttd-node__connector" />

                  {/* dot on the line */}
                  <div
                    className={`rttd-node__dot ${showPulse && i === 0 ? "rttd-node__dot--pulse" : ""}`}
                  />

                  {/* card */}
                  <TimelineCard
                    item={item}
                    index={i}
                    onClick={() => toggleExpand(item.id)}
                    isExpanded={expandedId === item.id}
                    isActive={activeIndex === i}
                  />
                </div>
              );
            })}

            {/* Doomsday final node */}
            <div
              className="rttd-node rttd-node--above rttd-node--doomsday"
              style={{
                left: doomX,
                top: lineY,
              }}
            >
              <DoomsdayNode
                onClick={() => toggleExpand("doom")}
                isExpanded={expandedId === "doom"}
                isActive={activeIndex === TIMELINE_ITEMS.length}
              />
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="rttd-scroll-arrows">
          <button
            className="rttd-scroll-btn rttd-scroll-btn--left"
            onClick={goPrev}
            disabled={activeIndex <= 0}
            aria-label="Previous movie"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="rttd-scroll-btn rttd-scroll-btn--right"
            onClick={goNext}
            disabled={activeIndex >= TOTAL_NODES - 1}
            aria-label="Next movie"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </section>

      {/* footer */}
      <footer className="rttd-footer">
        <div className="rttd-footer__inner">
          <button className="rttd-footer__back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <p className="rttd-footer__credit">
            Marvel and all related characters © Marvel Entertainment
          </p>
        </div>
      </footer>
    </div>
  );
}
