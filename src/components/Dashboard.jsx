import { useEffect, useRef, useState } from "react";
import HyperspeedBackground from "./HyperspeedBackground";
import DayNightToggle from "./DayNightToggle";
import MarvelHistory from "./MarvelHistory";
import MarvelMovies from "./MarvelMovies";
import RoadToDoomsday from "./RoadToDoomsday";
import DoomsdayCountdown from "./DoomsdayCountdown";
import ProfilePage from "./ProfilePage";
import "../styles/MarvelHistory.css";
import "../styles/MarvelMovies.css";
import "../styles/RoadToDoomsday.css";
import "../styles/DoomsdayCountdown.css";
import "../styles/DashboardExtras.css";

const CARDS = [
  {
    id: "history",
    icon: "📖",
    title: "Marvel History",
    subtitle: "Explore the origins",
    description: "Dive into the rich legacy of Marvel Comics from 1939 to present day.",
  },
  {
    id: "movies",
    icon: "🎬",
    title: "Marvel Movies",
    subtitle: "Watch the saga",
    description: "Browse the complete Marvel Cinematic Universe timeline and ratings.",
  },
  {
    id: "road-to-doomsday",
    icon: "⚡",
    title: "Road to Doomsday",
    subtitle: "The path unfolds",
    description: "Trace the events leading up to the Doomsday storyline.",
  },
  {
    id: "countdown",
    icon: "🕐",
    title: "Doomsday Countdown",
    subtitle: "Time is running out",
    description: "Track the countdown to the biggest Marvel event yet.",
  },
];

const UNIVERSE_STATS = [
  { label: "Movies", value: "35" },
  { label: "Series & Specials", value: "24" },
  { label: "MCU Phases", value: "6" },
];

const SAGAS = [
  { name: "The Infinity Saga", range: "Phases 1–3", progress: 100 },
  { name: "The Multiverse Saga", range: "Phases 4–6", progress: 66 },
];

const FEATURED_CHARACTER = {
  name: "Spider-Man",
  alias: "Peter Parker · Friendly Neighborhood Hero",
  quote: "With great power comes great responsibility.",
  earth: "Earth-616",
  image: "/spiderman-mask.svg",
};

const UPCOMING_RELEASES = [
  { title: "Avengers: Doomsday", type: "Film · Phase 6", date: "Dec 18, 2026" },
  { title: "Vision Quest", type: "Series · Disney+", date: "2026" },
  { title: "X-Men", type: "Film · Phase 6", date: "2027" },
  { title: "Avengers: Secret Wars", type: "Film · Phase 6", date: "Dec 17, 2027" },
];

const QUOTES = [
  { text: "I am Iron Man.", author: "Tony Stark" },
  { text: "I can do this all day.", author: "Steve Rogers" },
  { text: "Whatever it takes.", author: "The Avengers" },
  { text: "Wakanda forever!", author: "T'Challa" },
  { text: "I'm always angry.", author: "Bruce Banner" },
  { text: "Part of the journey is the end.", author: "Tony Stark" },
  { text: "The world has changed, and none of us can go back.", author: "Peggy Carter" },
];

const SIDEBAR_ITEMS = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "movies", icon: "🎬", label: "Movies" },
  { id: "road-to-doomsday", icon: "⚡", label: "Road to Doomsday" },
  { id: "countdown", icon: "🕐", label: "Countdown" },
  { id: "explore", icon: "🌐", label: "Explore Marvel" },
  { id: "profile", icon: "👤", label: "Profile" },
];

const EXPLORE_LINKS = [
  { id: "marvel", icon: "🦸", label: "Marvel Official Website", url: "https://www.marvel.com/" },
  { id: "jiohotstar", icon: "🌟", label: "JioHotstar", url: "https://www.hotstar.com/in" },
  { id: "netflix", icon: "🎥", label: "Netflix", url: "https://www.netflix.com/in/" },
  { id: "primevideo", icon: "📦", label: "Amazon Prime Video", url: "https://www.primevideo.com/" },
  { id: "sonyliv", icon: "📺", label: "Sony LIV", url: "https://www.sonyliv.com/" },
  { id: "appletv", icon: "🍎", label: "Apple TV", url: "https://tv.apple.com/in" },
];

export default function Dashboard({ onLogout, user, onUserUpdate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef(null);
  // Day mode is the default after login
  const [mode, setMode] = useState("day");

  // Close the "Explore Marvel" menu on outside click or Escape
  useEffect(() => {
    if (!exploreOpen) return;
    const handlePointerDown = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setExploreOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [exploreOpen]);

  // Apply the mode to every page of the site
  useEffect(() => {
    document.body.classList.add(
      mode === "night" ? "theme-night" : "theme-day"
    );
    return () => {
      document.body.classList.remove("theme-day", "theme-night");
    };
  }, [mode]);

  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  // Pick today's quote deterministically from the day of the year
  const now = new Date();
  const dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / 86400000
  );
  const dailyQuote = QUOTES[dayOfYear % QUOTES.length];

  const handleNavClick = (id) => {
    setExploreOpen(false);
    setActiveSection(id);
    setSidebarOpen(false);
    if (id === "logout" && onLogout) onLogout();
  };

  const handleCardClick = (id) => {
    setActiveSection(id);
  };

  if (activeSection === "history") {
    return (
      <MarvelHistory
        onBack={() => setActiveSection("dashboard")}
      />
    );
  }

  if (activeSection === "movies") {
    return (
      <MarvelMovies
        onBack={() => setActiveSection("dashboard")}
      />
    );
  }

  if (activeSection === "road-to-doomsday") {
    return (
      <RoadToDoomsday
        onBack={() => setActiveSection("dashboard")}
      />
    );
  }

  if (activeSection === "countdown") {
    return (
      <DoomsdayCountdown
        onBack={() => setActiveSection("dashboard")}
      />
    );
  }

  if (activeSection === "profile") {
    return (
      <ProfilePage
        user={user}
        onBack={() => setActiveSection("dashboard")}
        onLogout={onLogout}
        mode={mode}
        onToggleMode={() => setMode((m) => (m === "day" ? "night" : "day"))}
        onUserUpdate={onUserUpdate}
      />
    );
  }

  return (
    <div className="dashboard">
      <HyperspeedBackground />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__brand">
          <img src="/Marvel-Logo.jpg" alt="MARVEL" className="sidebar__logo" />
          <span className="sidebar__brand-text">MARVEL</span>
        </div>

        <nav className="sidebar__nav">
          {SIDEBAR_ITEMS.map((item) =>
            item.id === "explore" ? (
              <div className="sidebar__group" key={item.id} ref={exploreRef}>
                <button
                  className={`sidebar__item ${
                    exploreOpen ? "sidebar__item--active" : ""
                  }`}
                  onClick={() => setExploreOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={exploreOpen}
                >
                  <span className="sidebar__item-icon">{item.icon}</span>
                  <span className="sidebar__item-label">{item.label}</span>
                  <span
                    className={`sidebar__chevron ${
                      exploreOpen ? "sidebar__chevron--open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>

                {exploreOpen && (
                  <div className="explore-menu" role="menu">
                    {EXPLORE_LINKS.map((link) => (
                      <a
                        key={link.id}
                        className="explore-menu__item"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setExploreOpen(false)}
                      >
                        <span className="explore-menu__icon">{link.icon}</span>
                        <span className="explore-menu__label">{link.label}</span>
                        <span className="explore-menu__ext" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.id}
                className={`sidebar__item ${
                  activeSection === item.id ? "sidebar__item--active" : ""
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="sidebar__item-icon">{item.icon}</span>
                <span className="sidebar__item-label">{item.label}</span>
              </button>
            )
          )}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__item sidebar__item--logout" onClick={() => handleNavClick("logout")}>
            <span className="sidebar__item-icon">🚪</span>
            <span className="sidebar__item-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard__main">
        {/* Top bar */}
        <header className="dashboard__topbar">
          <button
            className="topbar__menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1 className="topbar__title">
            {activeSection === "dashboard" ? "Dashboard" : activeSection.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>
          <div className="topbar__user">
            <span className="topbar__avatar">{userInitial}</span>
            <span className="topbar__name">{userName}</span>
            <DayNightToggle
              mode={mode}
              onToggle={() =>
                setMode((m) => (m === "day" ? "night" : "day"))
              }
            />
          </div>
        </header>

        {/* Cards grid */}
        <section className="dashboard__cards">
          {CARDS.map((card) => (
            <div key={card.id} className="dash-card" onClick={() => handleCardClick(card.id)}>
              <div className="dash-card__icon">{card.icon}</div>
              <h3 className="dash-card__title">{card.title}</h3>
              <p className="dash-card__subtitle">{card.subtitle}</p>
              <p className="dash-card__desc">{card.description}</p>
              <div className="dash-card__shine" />
            </div>
          ))}
        </section>

        {/* Universe highlights */}
        <section className="dash-extras" aria-label="Marvel Universe highlights">
          {/* 1. Statistics */}
          <article className="dash-panel dash-panel--stats">
            <span className="dash-panel__kicker">The Numbers</span>
            <h2 className="dash-panel__title">Marvel Universe</h2>

            <div className="mu-stats">
              {UNIVERSE_STATS.map((stat) => (
                <div className="mu-stat" key={stat.label}>
                  <span className="mu-stat__value">{stat.value}</span>
                  <span className="mu-stat__label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="mu-sagas">
              {SAGAS.map((saga) => (
                <div className="mu-saga" key={saga.name}>
                  <div className="mu-saga__top">
                    <span className="mu-saga__name">{saga.name}</span>
                    <span className="mu-saga__range">{saga.range}</span>
                  </div>
                  <div className="mu-saga__track">
                    <div
                      className="mu-saga__fill"
                      style={{ width: `${saga.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* 2. Featured character */}
          <article className="dash-panel dash-panel--hero">
            <span className="dash-panel__kicker">Featured Character</span>
            <div className="mu-hero">
              <div className="mu-hero__media">
                <img
                  src={FEATURED_CHARACTER.image}
                  alt={`${FEATURED_CHARACTER.name} mask illustration`}
                />
              </div>
              <div className="mu-hero__body">
                <h2 className="mu-hero__name">{FEATURED_CHARACTER.name}</h2>
                <p className="mu-hero__alias">{FEATURED_CHARACTER.alias}</p>
                <blockquote className="mu-hero__quote">
                  “{FEATURED_CHARACTER.quote}”
                </blockquote>
                <span className="mu-hero__earth">
                  {FEATURED_CHARACTER.earth}
                </span>
              </div>
            </div>
          </article>

          {/* 3. Upcoming releases */}
          <article className="dash-panel dash-panel--releases">
            <span className="dash-panel__kicker">The Road Ahead</span>
            <h2 className="dash-panel__title">Upcoming Releases</h2>

            <ul className="mu-releases">
              {UPCOMING_RELEASES.map((release) => (
                <li className="mu-release" key={release.title}>
                  <span className="mu-release__marker" aria-hidden="true" />
                  <div className="mu-release__info">
                    <h3 className="mu-release__title">{release.title}</h3>
                    <span className="mu-release__type">{release.type}</span>
                  </div>
                  <span className="mu-release__date">{release.date}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* 4. Quote of the day */}
          <article className="dash-panel dash-panel--quote">
            <span className="dash-panel__kicker">Quote of the Day</span>
            <div className="mu-daily">
              <span className="mu-daily__mark" aria-hidden="true">
                “
              </span>
              <blockquote className="mu-daily__text">{dailyQuote.text}</blockquote>
              <p className="mu-daily__author">— {dailyQuote.author}</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
