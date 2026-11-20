import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────
   MCU DATA — Phases 1-6
   ───────────────────────────────────── */
const PHASES = [
  {
    id: 1,
    title: "Phase 1",
    subtitle: "The Beginnings",
    tagline: "Building a universe of heroes",
    items: [
      { id: "im1", title: "Iron Man", year: 2008, type: "movie", hero: "Tony Stark / Iron Man", female: "Pepper Potts", villain: "Obadiah Stane / Iron Monger", director: "Jon Favreau", producer: "Kevin Feige", date: "May 2, 2008", watch: "JioHotstar" },
      { id: "ih1", title: "The Incredible Hulk", year: 2008, type: "movie", hero: "Bruce Banner / Hulk", female: "Betty Ross", villain: "Abomination (Emil Blonsky)", director: "Louis Leterrier", producer: "Kevin Feige", date: "June 13, 2008", watch: "JioHotstar, VI movies and tv" },
      { id: "im2", title: "Iron Man 2", year: 2010, type: "movie", hero: "Tony Stark / Iron Man", female: "Pepper Potts", villain: "Ivan Vanko / Whiplash", director: "Jon Favreau", producer: "Kevin Feige", date: "May 7, 2010", watch: "JioHotstar" },
      { id: "th1", title: "Thor", year: 2011, type: "movie", hero: "Thor", female: "Jane Foster", villain: "Loki", director: "Kenneth Branagh", producer: "Kevin Feige", date: "May 6, 2011", watch: "JioHotstar, VI movies and tv" },
      { id: "ca1", title: "Captain America: The First Avenger", year: 2011, type: "movie", hero: "Steve Rogers / Captain America", female: "Peggy Carter", villain: "Red Skull (Johann Schmidt)", director: "Joe Johnston", producer: "Kevin Feige", date: "July 22, 2011", watch: "JioHotstar" },
      { id: "av1", title: "The Avengers", year: 2012, type: "movie", hero: "The Avengers Team", female: "Black Widow (Natasha Romanoff)", villain: "Loki", director: "Joss Whedon", producer: "Kevin Feige", date: "May 4, 2012", watch: "JioHotstar, VI movies and tv" },
    ],
  },
  {
    id: 2,
    title: "Phase 2",
    subtitle: "Expanding the Universe",
    tagline: "Deeper stories, bigger stakes",
    items: [
      { id: "im3", title: "Iron Man 3", year: 2013, type: "movie", hero: "Tony Stark / Iron Man", female: "Pepper Potts", villain: "Aldrich Killian / The Mandarin", director: "Shane Black", producer: "Kevin Feige", date: "May 3, 2013", watch: "JioHotstar, VI movies and tv" },
      { id: "thd", title: "Thor: The Dark World", year: 2013, type: "movie", hero: "Thor", female: "Jane Foster", villain: "Malekith the Accursed", director: "Alan Taylor", producer: "Kevin Feige", date: "November 8, 2013", watch: "JioHotstar, VI movies and tv" },
      { id: "caa", title: "Captain America: The Winter Soldier", year: 2014, type: "movie", hero: "Steve Rogers / Captain America", female: "Black Widow (Natasha Romanoff)", villain: "Winter Soldier (Bucky Barnes) / HYDRA", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "April 4, 2014", watch: "JioHotstar" },
      { id: "gotg1", title: "Guardians of the Galaxy", year: 2014, type: "movie", hero: "Peter Quill / Star-Lord", female: "Gamora", villain: "Ronan the Accuser", director: "James Gunn", producer: "Kevin Feige", date: "August 1, 2014", watch: "JioHotstar" },
      { id: "aou", title: "Avengers: Age of Ultron", year: 2015, type: "movie", hero: "The Avengers Team", female: "Scarlet Witch (Wanda Maximoff)", villain: "Ultron", director: "Joss Whedon", producer: "Kevin Feige", date: "May 1, 2015", watch: "JioHotstar, VI movies and tv" },
      { id: "am1", title: "Ant-Man", year: 2015, type: "movie", hero: "Scott Lang / Ant-Man", female: "Hope van Dyne", villain: "Darren Cross / Yellowjacket", director: "Peyton Reed", producer: "Kevin Feige", date: "July 17, 2015", watch: "JioHotstar" },
    ],
  },
  {
    id: 3,
    title: "Phase 3",
    subtitle: "The Infinity Saga Climax",
    tagline: "War. Sacrifice. Legacy.",
    items: [
      { id: "cacw", title: "Captain America: Civil War", year: 2016, type: "movie", hero: "Steve Rogers / Captain America", female: "Black Widow (Natasha Romanoff)", villain: "Helmut Zemo", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "May 6, 2016", watch: "JioHotstar" },
      { id: "dstr", title: "Doctor Strange", year: 2016, type: "movie", hero: "Stephen Strange / Doctor Strange", female: "Christine Palmer", villain: "Dormammu / Kaecilius", director: "Scott Derrickson", producer: "Kevin Feige", date: "November 4, 2016", watch: "JioHotstar" },
      { id: "gotg2", title: "Guardians of the Galaxy Vol. 2", year: 2017, type: "movie", hero: "Peter Quill / Star-Lord", female: "Gamora", villain: "Ego the Living Planet", director: "James Gunn", producer: "Kevin Feige", date: "May 5, 2017", watch: "JioHotstar" },
      { id: "smh", title: "Spider-Man: Homecoming", year: 2017, type: "movie", hero: "Peter Parker / Spider-Man", female: "Liz Allan", villain: "Adrian Toomes / Vulture", director: "Jon Watts", producer: "Kevin Feige & Amy Pascal", date: "July 7, 2017", watch: "Netflix, Amazon Prime Video, JioHotstar, VI movies and tv" },
      { id: "thrr", title: "Thor: Ragnarok", year: 2017, type: "movie", hero: "Thor", female: "Valkyrie", villain: "Hela", director: "Taika Waititi", producer: "Kevin Feige", date: "November 3, 2017", watch: "JioHotstar" },
      { id: "bp1", title: "Black Panther", year: 2018, type: "movie", hero: "T'Challa / Black Panther", female: "Okoye / Shuri", villain: "Erik Killmonger", director: "Ryan Coogler", producer: "Kevin Feige", date: "February 16, 2018", watch: "JioHotstar, VI movies and tv" },
      { id: "amtw", title: "Ant-Man and the Wasp", year: 2018, type: "movie", hero: "Scott Lang / Ant-Man", female: "Hope van Dyne / Wasp", villain: "Ghost (Ava Starr)", director: "Peyton Reed", producer: "Kevin Feige", date: "July 6, 2018", watch: "JioHotstar, VI movies and tv" },
      { id: "aiw", title: "Avengers: Infinity War", year: 2018, type: "movie", hero: "The Avengers & Guardians", female: "Gamora / Scarlet Witch", villain: "Thanos", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "April 27, 2018", watch: "JioHotstar, VI movies and tv" },
      { id: "aeg", title: "Avengers: Endgame", year: 2019, type: "movie", hero: "The Avengers Team", female: "Black Widow / Captain Marvel", villain: "Thanos", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "April 26, 2019", watch: "JioHotstar, VI movies and tv" },
      { id: "smffh", title: "Spider-Man: Far From Home", year: 2019, type: "movie", hero: "Peter Parker / Spider-Man", female: "MJ (Michelle Jones)", villain: "Mysterio (Quentin Beck)", director: "Jon Watts", producer: "Kevin Feige & Amy Pascal", date: "July 2, 2019", watch: "Netflix, Amazon Prime Video, JioHotstar, Sony LIV, VI movies and tv" },
    ],
  },
  {
    id: 4,
    title: "Phase 4",
    subtitle: "A New Beginning",
    tagline: "The multiverse opens",
    items: [
      { id: "bw", title: "Black Widow", year: 2021, type: "movie", hero: "Natasha Romanoff / Black Widow", female: "Yelena Belova", villain: "Taskmaster (Antonia Dreykov)", director: "Cate Shortland", producer: "Kevin Feige", date: "July 9, 2021", watch: "JioHotstar" },
      { id: "sc", title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, type: "movie", hero: "Shang-Chi", female: "Katy Chen", villain: "Wenwu / The Mandarin", director: "Destin Daniel Cretton", producer: "Kevin Feige", date: "September 3, 2021", watch: "JioHotstar" },
      { id: "et", title: "Eternals", year: 2021, type: "movie", hero: "The Eternals", female: "Sersi", villain: "Arishem / Kro", director: "Chloé Zhao", producer: "Kevin Feige", date: "November 5, 2021", watch: "JioHotstar, VI movies and tv" },
      { id: "smnwh", title: "Spider-Man: No Way Home", year: 2021, type: "movie", hero: "Peter Parker / Spider-Man", female: "MJ (Michelle Jones)", villain: "Green Goblin / Electro / Doc Ock", director: "Jon Watts", producer: "Kevin Feige & Amy Pascal", date: "December 17, 2021", watch: "JioHotstar, Sony LIV" },
      { id: "dsmom", title: "Doctor Strange in the Multiverse of Madness", year: 2022, type: "movie", hero: "Stephen Strange / Doctor Strange", female: "America Chavez", villain: "Scarlet Witch (Wanda Maximoff)", director: "Sam Raimi", producer: "Kevin Feige", date: "May 6, 2022", watch: "JioHotstar, VI movies and tv" },
      { id: "tlk", title: "Thor: Love and Thunder", year: 2022, type: "movie", hero: "Thor", female: "Jane Foster / Mighty Thor", villain: "Gorr the God Butcher", director: "Taika Waititi", producer: "Kevin Feige", date: "July 8, 2022", watch: "JioHotstar" },
      { id: "bpwf", title: "Black Panther: Wakanda Forever", year: 2022, type: "movie", hero: "Shuri / Black Panther", female: "Okoye / Riri Williams", villain: "Namor", director: "Ryan Coogler", producer: "Kevin Feige", date: "November 11, 2022", watch: "JioHotstar, VI movies and tv" },
      { id: "wm", title: "WandaVision", year: 2021, type: "series", hero: "Wanda Maximoff / Vision", female: "Wanda Maximoff", villain: "Agatha Harkness", director: "Matt Shakman", producer: "Kevin Feige", date: "Jan 15 – Mar 5, 2021", watch: "JioHotstar, VI movies and tv" },
      { id: "faws", title: "The Falcon and the Winter Soldier", year: 2021, type: "series", hero: "Sam Wilson / Falcon & Bucky Barnes", female: "Sharon Carter", villain: "Baron Zemo / Flag Smashers", director: "Kari Skogland", producer: "Kevin Feige", date: "Mar 19 – Apr 23, 2021", watch: "JioHotstar, VI movies and tv" },
      { id: "loki1", title: "Loki (Season 1)", year: 2021, type: "series", hero: "Loki", female: "Sylvie", villain: "He Who Remains", director: "Kate Herron", producer: "Kevin Feige", date: "Jun 9 – Jul 14, 2021", watch: "JioHotstar, VI movies and tv" },
      { id: "hw", title: "Hawkeye", year: 2021, type: "series", hero: "Clint Barton / Hawkeye", female: "Kate Bishop", villain: "Kingpin / Echo", director: "Rhys Thomas", producer: "Kevin Feige", date: "Nov 24 – Dec 22, 2021", watch: "JioHotstar, VI movies and tv" },
      { id: "moonknight", title: "Moon Knight", year: 2022, type: "series", hero: "Marc Spector / Moon Knight", female: "Layla El-Faouly", villain: "Arthur Harrow", director: "Mohamed Diab", producer: "Kevin Feige", date: "Mar 30 – May 4, 2022", watch: "JioHotstar, VI movies and tv" },
      { id: "msm", title: "Ms. Marvel", year: 2022, type: "series", hero: "Kamala Khan / Ms. Marvel", female: "Kamala Khan", villain: "Clandestines / Damage Control", director: "Adil El Arbi & Bilall Fallah", producer: "Kevin Feige", date: "Jun 8 – Jul 13, 2022", watch: "JioHotstar, VI movies and tv" },
      { id: "moth", title: "She-Hulk: Attorney at Law", year: 2022, type: "series", hero: "Jennifer Walters / She-Hulk", female: "Jennifer Walters", villain: "Titania / Daredevil", director: "Kat Coiro", producer: "Kevin Feige", date: "Aug 18 – Oct 13, 2022", watch: "JioHotstar, VI movies and tv" },
      { id: "wbnw", title: "Werewolf by Night", year: 2022, type: "series", hero: "Jack Russell / Werewolf by Night", female: "Lara", villain: "Man-Thing / Verussa", director: "Michael Giacchino", producer: "Kevin Feige", date: "October 7, 2022", watch: "Not streaming yet" },
      { id: "gotgh", title: "Guardians of the Galaxy Holiday Special", year: 2022, type: "series", hero: "Guardians of the Galaxy", female: "Gamora", villain: "N/A", director: "James Gunn", producer: "Kevin Feige", date: "November 25, 2022", watch: "JioHotstar, VI movies and tv" },
    ],
  },
  {
    id: 5,
    title: "Phase 5",
    subtitle: "The Multiverse Escalates",
    tagline: "Echoes of Kang and beyond",
    items: [
      { id: "amtq", title: "Ant-Man and the Wasp: Quantumania", year: 2023, type: "movie", hero: "Scott Lang / Ant-Man", female: "Hope van Dyne / Wasp", villain: "Kang the Conqueror", director: "Peyton Reed", producer: "Kevin Feige", date: "February 17, 2023", watch: "JioHotstar" },
      { id: "gotg3", title: "Guardians of the Galaxy Vol. 3", year: 2023, type: "movie", hero: "Peter Quill / Star-Lord", female: "Gamora", villain: "High Evolutionary", director: "James Gunn", producer: "Kevin Feige", date: "May 5, 2023", watch: "VI movies and tv" },
      { id: "capm", title: "The Marvels", year: 2023, type: "movie", hero: "Carol Danvers / Captain Marvel", female: "Kamala Khan & Monica Rambeau", villain: "Dar-Benn", director: "Nia DaCosta", producer: "Kevin Feige", date: "November 10, 2023", watch: "VI movies and tv" },
      { id: "d&w", title: "Deadpool & Wolverine", year: 2024, type: "movie", hero: "Deadpool & Wolverine", female: "Cassandra Nova / B-15", villain: "Cassandra Nova", director: "Shawn Levy", producer: "Kevin Feige", date: "July 26, 2024", watch: "JioHotstar" },
      { id: "cmns", title: "Captain America: Brave New World", year: 2025, type: "movie", hero: "Sam Wilson / Captain America", female: "Ruth Bat-Seraph", villain: "The Leader (Samuel Sterns)", director: "Julius Onah", producer: "Kevin Feige", date: "February 14, 2025", watch: "Not streaming yet" },
      { id: "thunderbolts", title: "Thunderbolts*", year: 2025, type: "movie", hero: "The Thunderbolts", female: "Yelena Belova", villain: "Sentry / Valentina Allegra de Fontaine", director: "Jake Schreier", producer: "Kevin Feige", date: "May 2, 2025", watch: "JioHotstar" },
      { id: "loki2", title: "Loki (Season 2)", year: 2023, type: "series", hero: "Loki", female: "Sylvie", villain: "Victor Timely / Immortus", director: "Justin Benson & Aaron Moorhead", producer: "Kevin Feige", date: "Oct 5 – Nov 9, 2023", watch: "JioHotstar, VI movies and tv" },
      { id: "owen", title: "Secret Invasion", year: 2023, type: "series", hero: "Nick Fury", female: "G'iah / Sonya Falsworth", villain: "Gravik", director: "Ali Selim", producer: "Kevin Feige", date: "Jun 21 – Jul 26, 2023", watch: "JioHotstar, VI movies and tv" },
      { id: "lnx", title: "Loki", year: 2023, type: "series", hero: "Loki", female: "Sylvie", villain: "He Who Remains", director: "Justin Benson & Aaron Moorhead", producer: "Kevin Feige", date: "Oct 5 – Nov 9, 2023", watch: "JioHotstar, VI movies and tv" },
      { id: "echo", title: "Echo", year: 2024, type: "series", hero: "Maya Lopez / Echo", female: "Maya Lopez", villain: "Kingpin (Wilson Fisk)", director: "Sydney Freeland", producer: "Kevin Feige", date: "Jan 9 – Jan 30, 2024", watch: "JioHotstar" },
      { id: "agatha", title: "Agatha All Along", year: 2024, type: "series", hero: "Agatha Harkness", female: "Agatha Harkness", villain: "Rio Vidal / The Salem Seven", director: "Jac Schaeffer", producer: "Kevin Feige", date: "Sep 18 – Oct 30, 2024", watch: "JioHotstar, VI movies and tv" },
      { id: "dpss", title: "Your Friendly Neighborhood Spider-Man", year: 2025, type: "series", hero: "Peter Parker / Spider-Man", female: "Nico Minoru", villain: "Doctor Octopus", director: "Mel Zwyer", producer: "Kevin Feige", date: "January 29, 2025", watch: "JioHotstar, VI movies and tv" },
      { id: "daredevil", title: "Daredevil: Born Again", year: 2025, type: "series", hero: "Matt Murdock / Daredevil", female: "Karen Page / Heather Glenn", villain: "Kingpin (Wilson Fisk)", director: "Michael Cuesta", producer: "Kevin Feige", date: "March 4, 2025", watch: "JioHotstar" },
    ],
  },
  {
    id: 6,
    title: "Phase 6",
    subtitle: "The Road to Doomsday",
    tagline: "The end of an era begins",
    items: [
      { id: "ff", title: "The Fantastic Four: First Steps", year: 2025, type: "movie", hero: "The Fantastic Four", female: "Invisible Woman (Sue Storm)", villain: "Galactus / Silver Surfer", director: "Matt Shakman", producer: "Kevin Feige", date: "July 25, 2025", watch: "JioHotstar" },
      { id: "doom", title: "Avengers: Doomsday", year: 2026, type: "movie", hero: "The Avengers & X-Men", female: "Wanda / Jean Grey", villain: "Doctor Doom", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "May 1, 2026", watch: "Not streaming yet" },
      { id: "swangs", title: "Avengers: Secret Wars", year: 2027, type: "movie", hero: "All MCU Heroes", female: "Multiple", villain: "Doctor Doom / Beyonders", director: "Anthony & Joe Russo", producer: "Kevin Feige", date: "May 7, 2027", watch: "Not streaming yet" },
      { id: "wonder", title: "Wonder Man", year: 2025, type: "series", hero: "Simon Williams / Wonder Man", female: "Yet to be confirmed", villain: "Yet to be confirmed", director: "Destin Daniel Cretton", producer: "Kevin Feige", date: "December 2025", watch: "Not streaming yet" },
      { id: "visionq", title: "Vision Quest", year: 2026, type: "series", hero: "Vision", female: "Yet to be confirmed", villain: "Yet to be confirmed", director: "Terry Matalas", producer: "Kevin Feige", date: "2026", watch: "Not streaming yet" },
    ],
  },
];

/* ─── helper to flatten all titles ─── */
const ALL_ITEMS = PHASES.flatMap((p) => p.items);
const TOTAL_TITLES = ALL_ITEMS.length;
const TOTAL_MOVIES = ALL_ITEMS.filter((i) => i.type === "movie").length;
const TOTAL_SERIES = ALL_ITEMS.filter((i) => i.type === "series").length;

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

/* ─── Animated counter ─── */
function AnimNum({ target, duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const vis = useInView(ref);

  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, target, duration]);

  return <span ref={ref}>{val}</span>;
}

/* ─── Movie / Series Card ─── */
function MovieCard({ item, index }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  const [expanded, setExpanded] = useState(false);

  const isMovie = item.type === "movie";

  return (
    <div
      ref={ref}
      className={`mmc ${vis ? "mmc--vis" : ""} ${expanded ? "mmc--open" : ""}`}
      style={{ animationDelay: `${(index % 10) * 0.06}s` }}
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
      }}
    >
      {/* accent strip */}
      <div className="mmc__accent" />

      {/* header row */}
      <div className="mmc__head">
        <span className={`mmc__type mmc__type--${item.type}`}>
          {isMovie ? "🎬 Movie" : "📺 Series"}
        </span>
        <span className="mmc__year">{item.year}</span>
      </div>

      <h3 className="mmc__title">{item.title}</h3>
      <p className="mmc__date">{item.date}</p>

      {/* quick info */}
      <div className="mmc__quick">
        <div className="mmc__qi">
          <span className="mmc__qi-icon">🦸</span>
          <span className="mmc__qi-label">Hero</span>
          <span className="mmc__qi-value">{item.hero}</span>
        </div>
        <div className="mmc__qi">
          <span className="mmc__qi-icon">⚔️</span>
          <span className="mmc__qi-label">Villain</span>
          <span className="mmc__qi-value">{item.villain}</span>
        </div>
      </div>

      {/* expand arrow */}
      <div className="mmc__arrow">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* expanded detail */}
      <div className="mmc__detail">
        <div className="mmc__detail-grid">
          <div className="mmc__di">
            <span className="mmc__di-label">👩 Lead Female</span>
            <span className="mmc__di-value">{item.female}</span>
          </div>
          <div className="mmc__di">
            <span className="mmc__di-label">🎥 Director</span>
            <span className="mmc__di-value">{item.director}</span>
          </div>
          <div className="mmc__di">
            <span className="mmc__di-label">🎞️ Producer</span>
            <span className="mmc__di-value">{item.producer}</span>
          </div>
          <div className="mmc__di">
            <span className="mmc__di-label">📅 Release Date</span>
            <span className="mmc__di-value">{item.date}</span>
          </div>
          <div className="mmc__di mmc__di--full">
            <span className="mmc__di-label">📺 Where to Watch</span>
            <span className="mmc__di-value mmc__di-value--highlight">{item.watch}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Phase Section ─── */
function PhaseSection({ phase }) {
  const ref = useRef(null);
  const vis = useInView(ref);

  return (
    <section
      ref={ref}
      className={`mm-phase ${vis ? "mm-phase--vis" : ""}`}
    >
      <div className="mm-phase__inner">
        {/* phase header */}
        <div className="mm-phase__header">
          <div className="mm-phase__num">{String(phase.id).padStart(2, "0")}</div>
          <div className="mm-phase__text">
            <span className="mm-phase__tag">{phase.title}</span>
            <h2 className="mm-phase__title">{phase.subtitle}</h2>
            <p className="mm-phase__tagline">{phase.tagline}</p>
          </div>
          <div className="mm-phase__count">
            <span className="mm-phase__count-num">{phase.items.length}</span>
            <span className="mm-phase__count-label">Titles</span>
          </div>
        </div>

        {/* movie grid */}
        <div className="mm-phase__grid">
          {phase.items.map((item, i) => (
            <MovieCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Component ─── */
export default function MarvelMovies({ onBack }) {
  const heroRef = useRef(null);
  const heroVis = useInView(heroRef);

  return (
    <div className="marvel-movies">
      {/* ambient bg */}
      <div className="mm-bg" aria-hidden="true">
        <img src="/Marvel.webp" alt="" />
      </div>
      <div className="mm-bg-dark" />

      {/* top nav */}
      <nav className="mm-topnav">
        <div className="mm-topnav__inner">
          <button className="mm-back" onClick={onBack} aria-label="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </button>
        </div>
      </nav>

      {/* hero */}
      <section className="mm-hero" ref={heroRef}>
        <div className="mm-hero__bg">
          <div className="mm-hero__overlay" />
          <div className="mm-hero__grid" />
        </div>
        <div className={`mm-hero__content ${heroVis ? "mm-hero__content--vis" : ""}`}>
          <div className="mm-hero__badge">PHASES 1 – 6</div>
          <h1 className="mm-hero__title">
            <span className="mm-hero__line1">Marvel Cinematic</span>
            <span className="mm-hero__line2">Universe</span>
          </h1>
          <p className="mm-hero__subtitle">
            Every movie and series in the MCU — from Iron Man to Secret Wars.
            The complete cinematic experience of the world's largest franchise.
          </p>

          <div className="mm-hero__stats">
            <div className="mm-hero__stat">
              <div className="mm-hero__stat-num"><AnimNum target={TOTAL_TITLES} /></div>
              <div className="mm-hero__stat-label">Total Titles</div>
            </div>
            <div className="mm-hero__stat">
              <div className="mm-hero__stat-num"><AnimNum target={TOTAL_MOVIES} /></div>
              <div className="mm-hero__stat-label">Movies</div>
            </div>
            <div className="mm-hero__stat">
              <div className="mm-hero__stat-num"><AnimNum target={TOTAL_SERIES} /></div>
              <div className="mm-hero__stat-label">Web Series</div>
            </div>
            <div className="mm-hero__stat">
              <div className="mm-hero__stat-num">$30B+</div>
              <div className="mm-hero__stat-label">Box Office</div>
            </div>
          </div>
        </div>
      </section>

      {/* phases */}
      {PHASES.map((phase) => (
        <PhaseSection key={phase.id} phase={phase} />
      ))}

      {/* footer */}
      <footer className="mm-footer">
        <div className="mm-footer__inner">
          <button className="mm-footer__back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <p className="mm-footer__credit">
            Marvel and all related characters © Marvel Entertainment
          </p>
        </div>
      </footer>
    </div>
  );
}
