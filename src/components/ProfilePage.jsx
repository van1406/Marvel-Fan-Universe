import { useState, useEffect, useRef } from "react";
import DayNightToggle from "./DayNightToggle";
import { fetchProfile } from "../api/auth";
import "../styles/Profile.css";

/** Where the backend JWT is stored after login (null → show the user prop). */
const TOKEN_KEY = "marvel_token";

/**
 * Hero details data — brief info for each possible favourite hero.
 */
const HERO_DETAILS = {
  "Iron Man": {
    realName: "Tony Stark",
    powers: "Genius-level intellect, powered armor suit with repulsor beams, flight, super strength",
    firstAppearance: "Tales of Suspense #39 (1963)",
    desc: "Billionaire inventor Tony Stark built a powered suit of armor to escape captivity and became one of Earth's Mightiest Heroes. A founding Avenger and the heart of the MCU.",
  },
  "Spider-Man": {
    realName: "Peter Parker",
    powers: "Wall-crawling, spider-sense, super strength, agility, webslinging",
    firstAppearance: "Amazing Fantasy #15 (1962)",
    desc: "After being bitten by a radioactive spider, high school student Peter Parker gained incredible powers. With great power comes great responsibility — the mantra that defines Marvel's most iconic hero.",
  },
  "Captain America": {
    realName: "Steve Rogers",
    powers: "Super soldier serum: enhanced strength, speed, endurance, vibranium shield",
    firstAppearance: "Captain America Comics #1 (1941)",
    desc: "A frail young man from Brooklyn transformed into the ultimate super soldier. Steve Rogers fought in WWII, was frozen in ice, and awoke decades later to lead the Avengers.",
  },
  "Thor": {
    realName: "Thor Odinson",
    powers: "God of thunder, Mjolnir, super strength, weather manipulation, flight",
    firstAppearance: "Journey into Mystery #83 (1962)",
    desc: "The Asgardian God of Thunder and son of Odin. Wielding the enchanted hammer Mjolnir, Thor defends both Earth and the Nine Realms from cosmic threats.",
  },
  "Black Panther": {
    realName: "T'Challa",
    powers: "Enhanced strength from Heart-Shaped Herb, vibranium suit, genius intellect",
    firstAppearance: "Fantastic Four #52 (1966)",
    desc: "King of the advanced African nation of Wakanda, T'Challa is both a warrior and a scholar. The first Black superhero in mainstream American comics.",
  },
  "Doctor Strange": {
    realName: "Stephen Strange",
    powers: "Mystic arts, spellcasting, dimensional travel, Time Stone (formerly)",
    firstAppearance: "Strange Tales #110 (1963)",
    desc: "A former neurosurgeon who became the Sorcerer Supreme after a career-ending accident led him to study the mystic arts. Protector of Earth from magical threats.",
  },
  "Black Widow": {
    realName: "Natasha Romanoff",
    powers: "Expert spy, hand-to-hand combat, espionage, tactical genius",
    firstAppearance: "Tales of Suspense #52 (1964)",
    desc: "A former Soviet assassin turned S.H.I.E.L.D. agent and Avenger. Natasha Romanoff is one of the world's greatest spies and a founding member of the MCU Avengers.",
  },
  "Hulk": {
    realName: "Dr. Bruce Banner",
    powers: "Incredible super strength, regeneration, rage-powered transformation",
    firstAppearance: "Incredible Hulk #1 (1962)",
    desc: "Exposed to gamma radiation, scientist Bruce Banner transforms into the Hulk — the strongestAvenger. The angrier he gets, the stronger he becomes.",
  },
  "Wolverine": {
    realName: "Logan / James Howlett",
    powers: "Healing factor, adamantium claws, super senses, extended lifespan",
    firstAppearance: "Incredible Hulk #181 (1974)",
    desc: "A mutant with animal-keen senses, enhanced physical capabilities, and a regenerative healing factor. His skeleton and claws are bonded with the virtually indestructible metal adamantium.",
  },
  "Scarlet Witch": {
    realName: "Wanda Maximoff",
    powers: "Chaos magic, reality warping, telekinesis, telepathy",
    firstAppearance: "X-Men #4 (1964)",
    desc: "One of the most powerful beings in the Marvel Universe. Wanda Maximoff can alter reality itself and has been both an Avenger and a threat to the multiverse.",
  },
  "Deadpool": {
    realName: "Wade Wilson",
    powers: "Healing factor, fourth-wall breaking, expert combat, regeneration",
    firstAppearance: "New Mutants #98 (1991)",
    desc: "The Merc with a Mouth. A disfigured former special forces operative turned antihero with an accelerated healing factor and an annoying habit of breaking the fourth wall.",
  },
  "Ant-Man": {
    realName: "Scott Lang",
    powers: "Size manipulation via Pym Particles, super strength at ant-size, communication with ants",
    firstAppearance: "Avengers #181 (1979)",
    desc: "A reformed thief who inherited the Ant-Man suit from Hank Pym. Scott Lang uses his ability to shrink to atomic size to fight crime and has been a key Avenger.",
  },
  "Captain Marvel": {
    realName: "Carol Danvers",
    powers: "Photon blasts, flight, super strength, energy absorption, durability",
    firstAppearance: "Marvel Super-Heroes #13 (1968)",
    desc: "A former US Air Force pilot who gained cosmic powers through a Kree explosion. Carol Danvers is one of the most powerful heroes in the Marvel Universe.",
  },
  "Storm": {
    realName: "Ororo Munroe",
    powers: "Weather manipulation, flight, environmental adaptation",
    firstAppearance: "Giant-Size X-Men #1 (1975)",
    desc: "A mutant with the ability to control weather patterns. Ororo Munroe is a goddess-level mutant who has served as leader of the X-Men and queen of Wakanda.",
  },
  "Daredevil": {
    realName: "Matt Murdock",
    powers: "Radar sense, enhanced senses, expert martial artist, peak human condition",
    firstAppearance: "Daredevil #1 (1964)",
    desc: "Blinded by radioactive waste as a child, Matt Murdock's remaining senses were enhanced to superhuman levels. By day a defense attorney, by night the Man Without Fear.",
  },
  "Punisher": {
    realName: "Frank Castle",
    powers: "Expert tactician, weapons mastery, peak human condition, relentless determination",
    firstAppearance: "Amazing Spider-Man #129 (1974)",
    desc: "After his family was murdered by the mob, Frank Castle became the Punisher — a vigilante who wages a one-man war on crime using lethal force.",
  },
  "Luke Cage": {
    realName: "Carl Lucas / Luke Cage",
    powers: "Superhuman strength, unbreakable skin, healing factor",
    firstAppearance: "Hero for Hire #1 (1972)",
    desc: "Wrongfully convicted and experimented on in prison, Luke Cage gained unbreakable skin and super strength. He became a hero for hire on the streets of Harlem.",
  },
  "Jessica Jones": {
    realName: "Jessica Jones",
    powers: "Super strength, flight, limited invulnerability, investigative skills",
    firstAppearance: "Alias #1 (2001)",
    desc: "A former superhero turned private investigator. After a traumatic encounter with Kilgrave, Jessica Jones rebuilt her life as a hard-drinking, sharp-witted detective.",
  },
  "Moon Knight": {
    realName: "Marc Spector / Steven Grant",
    powers: "Enhanced strength (at night), depending on moon phases, martial arts, multiple identities",
    firstAppearance: "Werewolf by Night #32 (1975)",
    desc: "Resurrected by the Egyptian moon god Khonshu, Marc Spector serves as the Fist of Khonshu. His dissociative identity disorder makes him one of Marvel's most complex heroes.",
  },
  "Shang-Chi": {
    realName: "Shang-Chi",
    powers: "Master martial artist, chi manipulation, Ten Rings (MCU)",
    firstAppearance: "Special Marvel Edition #15 (1973)",
    desc: "The Master of Kung Fu. Shang-Chi is considered one of the greatest hand-to-hand combatants in the Marvel Universe, trained from birth to be the perfect warrior.",
  },
};

/** Same hero set the Sign Up form offers. */
const HERO_OPTIONS = Object.keys(HERO_DETAILS);

function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

export default function ProfilePage({
  user,
  onBack,
  onLogout,
  mode = "day",
  onToggleMode = () => {},
  onUserUpdate,
}) {
  const [selectedHero, setSelectedHero] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", favouriteHero: "" });
  const [editError, setEditError] = useState("");
  const [serverUser, setServerUser] = useState(null);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef);

  // Load the logged-in user's profile from the backend using the stored JWT.
  // No token or a failed request keeps the existing `user` prop data, so the
  // page renders exactly as it did before.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return undefined;
    let active = true;
    fetchProfile(token).then(({ ok, data }) => {
      if (active && ok && data?.user) setServerUser(data.user);
    });
    return () => {
      active = false;
    };
  }, []);

  // Backend profile wins when loaded; otherwise the authenticated user prop.
  const profile = serverUser || user || {};
  const name = profile.name || "User";
  const email = profile.email || "";
  const favouriteHero = profile.favouriteHero || "";
  const heroDetails = favouriteHero ? HERO_DETAILS[favouriteHero] : null;
  const initial = name.charAt(0).toUpperCase();

  const startEditing = () => {
    setDraft({ name, favouriteHero });
    setEditError("");
    setSelectedHero(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditError("");
  };

  const saveProfile = (ev) => {
    ev.preventDefault();
    const newName = draft.name.trim();
    if (!newName) {
      setEditError("Name is required");
      return;
    }
    const updated = {
      ...profile,
      name: newName,
      favouriteHero: draft.favouriteHero,
    };
    // Persist so the next sign-in reflects the edit.
    try {
      if (updated.email) {
        const users = JSON.parse(localStorage.getItem("marvel_users") || "{}");
        users[updated.email.toLowerCase()] = updated;
        localStorage.setItem("marvel_users", JSON.stringify(users));
      }
    } catch {
      /* storage unavailable — the edit still applies to this session */
    }
    // Keep the backend-sourced copy in sync so the edit shows immediately.
    if (serverUser) setServerUser(updated);
    if (onUserUpdate) onUserUpdate(updated);
    setEditing(false);
  };

  return (
    <div className="profile-page">
      {/* Background */}
      <div className="profile-bg" aria-hidden="true">
        <img src="/Marvel.webp" alt="" />
      </div>
      <div className="profile-bg-dark" />

      {/* Top navigation */}
      <nav className="profile-topnav">
        <div className="profile-topnav__inner">
          <button className="profile-back" onClick={onBack} aria-label="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </button>
        </div>
      </nav>

      {/* Profile header */}
      <section className="profile-hero" ref={heroRef}>
        <div className={`profile-hero__content ${heroInView ? "profile-hero__content--visible" : ""}`}>
          <div className="profile-avatar">
            <div className="profile-avatar__circle">{initial}</div>
            <div className="profile-avatar__ring" />
          </div>
          <h1 className="profile-name">{name}</h1>
          <p className="profile-email">{email}</p>
        </div>
      </section>

      {/* Profile details card */}
      <section className="profile-section">
        <div className="profile-section__inner">
          <div className="profile-card">
            <div className="profile-card__header">
              <span className="profile-card__tag">
                {editing ? "Edit Profile" : "Account Details"}
              </span>
            </div>
            <div className="profile-card__body">
              {/* Inline edit form */}
              {editing && (
                <form className="profile-edit" onSubmit={saveProfile} noValidate>
                  <div className="profile-field">
                    <label htmlFor="profile-edit-name">Full Name</label>
                    <input
                      id="profile-edit-name"
                      type="text"
                      placeholder="Tony Stark"
                      value={draft.name}
                      autoComplete="name"
                      onChange={(e) => {
                        setDraft((p) => ({ ...p, name: e.target.value }));
                        setEditError("");
                      }}
                    />
                  </div>
                  <div className="profile-field">
                    <label htmlFor="profile-edit-email">Email</label>
                    <input
                      id="profile-edit-email"
                      type="email"
                      value={email}
                      readOnly
                      disabled
                    />
                    <span className="profile-field__note">
                      Your sign-in email can&apos;t be changed
                    </span>
                  </div>
                  <div className="profile-field">
                    <label htmlFor="profile-edit-hero">Favourite Superhero</label>
                    <select
                      id="profile-edit-hero"
                      value={draft.favouriteHero}
                      onChange={(e) =>
                        setDraft((p) => ({ ...p, favouriteHero: e.target.value }))
                      }
                    >
                      <option value="">— Choose your hero —</option>
                      {HERO_OPTIONS.map((hero) => (
                        <option key={hero} value={hero}>
                          {hero}
                        </option>
                      ))}
                    </select>
                  </div>
                  {editError && (
                    <div className="profile-field__error" role="alert">
                      {editError}
                    </div>
                  )}
                  <div className="profile-edit__actions">
                    <button
                      type="button"
                      className="profile-btn profile-btn--ghost"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="profile-btn profile-btn--primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Read-only account details */}
              {!editing && (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-row__label">Full Name</span>
                    <span className="profile-info-row__value">{name}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-row__label">Email</span>
                    <span className="profile-info-row__value">{email}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-row__label">Favourite Superhero</span>
                    {favouriteHero ? (
                      <button
                        className="profile-info-row__hero-link"
                        onClick={() => setSelectedHero(selectedHero ? null : favouriteHero)}
                      >
                        {favouriteHero}
                        <span className="profile-info-row__arrow">{selectedHero ? "▲" : "▼"}</span>
                      </button>
                    ) : (
                      <span className="profile-info-row__value profile-info-row__value--muted">Not selected</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hero details expansion */}
          {selectedHero && heroDetails && (
            <div className="profile-hero-detail">
              <div className="profile-hero-detail__card">
                <div className="profile-hero-detail__header">
                  <div className="profile-hero-detail__icon">🦸</div>
                  <div>
                    <h3 className="profile-hero-detail__name">{selectedHero}</h3>
                    <p className="profile-hero-detail__realname">{heroDetails.realName}</p>
                  </div>
                </div>
                <div className="profile-hero-detail__body">
                  <div className="profile-hero-detail__field">
                    <span className="profile-hero-detail__label">Powers</span>
                    <p className="profile-hero-detail__text">{heroDetails.powers}</p>
                  </div>
                  <div className="profile-hero-detail__field">
                    <span className="profile-hero-detail__label">First Appearance</span>
                    <p className="profile-hero-detail__text">{heroDetails.firstAppearance}</p>
                  </div>
                  <div className="profile-hero-detail__field">
                    <span className="profile-hero-detail__label">About</span>
                    <p className="profile-hero-detail__text">{heroDetails.desc}</p>
                  </div>
                </div>
                <button
                  className="profile-hero-detail__close"
                  onClick={() => setSelectedHero(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Day / Night preference */}
          <div className="profile-prefs">
            <div className="profile-card">
              <div className="profile-card__header">
                <span className="profile-card__tag">Preferences</span>
              </div>
              <div className="profile-card__body">
                <div className="profile-info-row">
                  <div className="profile-prefs__text">
                    <span className="profile-info-row__label">Day / Night</span>
                    <span className="profile-prefs__state">
                      {mode === "night" ? "Night mode" : "Day mode"}
                    </span>
                  </div>
                  <DayNightToggle mode={mode} onToggle={onToggleMode} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!editing && (
            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn profile-btn--primary"
                onClick={startEditing}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
                Edit Profile
              </button>
              <button
                type="button"
                className="profile-btn profile-btn--logout"
                onClick={() => onLogout && onLogout()}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="profile-footer__inner">
          <button className="profile-footer__back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <p className="profile-footer__credit">
            Marvel and all related characters © Marvel Entertainment
          </p>
        </div>
      </footer>
    </div>
  );
}
