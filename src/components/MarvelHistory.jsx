import { useState, useEffect, useRef } from "react";

const MILESTONES = [
  {
    year: "1939",
    title: "Timely Publications Founded",
    desc: "Martin Goodman launches Timely Publications with Marvel Comics #1, featuring the Human Torch and Namor the Sub-Mariner.",
    icon: "🔥",
  },
  {
    year: "1941",
    title: "Captain America Arrives",
    desc: "Captain America Comics #1 debuts, created by Joe Simon and Jack Kirby. The issue sells nearly 1 million copies.",
    icon: "🛡️",
  },
  {
    year: "1950s",
    title: "Atlas Comics Era",
    desc: "The company rebrands as Atlas Comics, publishing horror, sci-fi, and monster stories during a shifting comics landscape.",
    icon: "📖",
  },
  {
    year: "1961",
    title: "The Marvel Age Begins",
    desc: "Fantastic Four #1 launches the Marvel Universe as we know it. Stan Lee and Jack Kirby redefine superhero storytelling.",
    icon: "💥",
  },
  {
    year: "1962",
    title: "Icons Are Born",
    desc: "Spider-Man, the Incredible Hulk, Thor, and Iron Man all debut — creating a universe of flawed, relatable heroes.",
    icon: "🕷️",
  },
  {
    year: "1963",
    title: "X-Men & Avengers Assemble",
    desc: "The X-Men and The Avengers debut, expanding the Marvel Universe into team-based storytelling.",
    icon: "⚔️",
  },
  {
    year: "2008",
    title: "The MCU Begins",
    desc: "Iron Man hits theaters and launches the Marvel Cinematic Universe — changing cinema forever.",
    icon: "🎬",
  },
  {
    year: "2009",
    title: "Disney Acquires Marvel",
    desc: "The Walt Disney Company acquires Marvel Entertainment for $4 billion, securing its place in pop culture history.",
    icon: "🏰",
  },
  {
    year: "2012",
    title: "The Avengers Unite",
    desc: "The Avengers becomes a global phenomenon, proving the shared universe model works on the big screen.",
    icon: "🦸",
  },
  {
    year: "2019",
    title: "Endgame Era",
    desc: "Avengers: Endgame becomes the highest-grossing film of all time. Kevin Feige named Chief Creative Officer of Marvel.",
    icon: "🏆",
  },
  {
    year: "2025",
    title: "The Multiverse Saga Continues",
    desc: "Marvel Studios pushes into the Multiverse Saga with new characters, stories, and the road to Doomsday.",
    icon: "🌀",
  },
];

const LEADERSHIP = [
  {
    name: "Kevin Feige",
    role: "President, Marvel Studios & Chief Creative Officer",
    since: "2007",
    desc: "The architect of the MCU. Feige has overseen every Marvel Studios film and series, building the most successful franchise in entertainment history with over $30 billion in worldwide box office.",
    initial: "K",
  },
  {
    name: "Dana Walden",
    role: "Co-Chairman, Disney Entertainment",
    since: "2023",
    desc: "Overseeing Disney's entertainment divisions including Marvel Television and general entertainment content across streaming and linear platforms.",
    initial: "D",
  },
  {
    name: "Louis D'Esposito",
    role: "Co-President, Marvel Studios",
    since: "2015",
    desc: "A founding member of Marvel Studios who has been instrumental in production and operations since the studio's earliest days.",
    initial: "L",
  },
  {
    name: "Victoria Alonso",
    role: "Former EVP, Physical & Post Production",
    since: "2006–2023",
    desc: "A key creative force behind the visual effects and post-production pipeline of the MCU for nearly two decades.",
    initial: "V",
  },
];

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

function AnimatedNumber({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className={`timeline-item ${inView ? "timeline-item--visible" : ""} ${
        index % 2 === 0 ? "timeline-item--left" : "timeline-item--right"
      }`}
    >
      <div className="timeline-item__dot">
        <span>{item.icon}</span>
      </div>
      <div className="timeline-item__card">
        <span className="timeline-item__year">{item.year}</span>
        <h3 className="timeline-item__title">{item.title}</h3>
        <p className="timeline-item__desc">{item.desc}</p>
      </div>
    </div>
  );
}

function LeadershipCard({ member, index }) {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className={`leadership-card ${inView ? "leadership-card--visible" : ""}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="leadership-card__avatar">{member.initial}</div>
      <div className="leadership-card__info">
        <h4 className="leadership-card__name">{member.name}</h4>
        <p className="leadership-card__role">{member.role}</p>
        <p className="leadership-card__since">Since {member.since}</p>
        <p className="leadership-card__desc">{member.desc}</p>
      </div>
    </div>
  );
}

export default function MarvelHistory({ onBack }) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef);

  const now = new Date();
  const marvelAge =
    now.getFullYear() - 1939; // 87 years in 2026

  return (
    <div className="marvel-history">
      {/* Full-page background image */}
      <div className="mh-bg" aria-hidden="true">
        <img src="/Marvel.webp" alt="" />
      </div>
      <div className="mh-bg-dark" />

      {/* Top navigation bar */}
      <nav className="mh-topnav">
        <div className="mh-topnav__inner">
          <button className="mh-back" onClick={onBack} aria-label="Back to Dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mh-hero" ref={heroRef}>
        <div className="mh-hero__bg">
          <div className="mh-hero__overlay" />
          <div className="mh-hero__grid" />
        </div>
        <div className={`mh-hero__content ${heroInView ? "mh-hero__content--visible" : ""}`}>
          <div className="mh-hero__badge">EST. 1939</div>
          <h1 className="mh-hero__title">
            <span className="mh-hero__title-line1">The Marvel</span>
            <span className="mh-hero__title-line2">Universe</span>
          </h1>
          <p className="mh-hero__subtitle">
            From a single comic book in 1939 to a global entertainment empire — the story of Marvel is the story of modern mythology.
          </p>
          <div className="mh-hero__stats">
            <div className="mh-stat">
              <div className="mh-stat__number">
                <AnimatedNumber target={marvelAge} />
              </div>
              <div className="mh-stat__label">Years of Marvel</div>
            </div>
            <div className="mh-stat">
              <div className="mh-stat__number">8,000+</div>
              <div className="mh-stat__label">Characters</div>
            </div>
            <div className="mh-stat">
              <div className="mh-stat__number">$30B+</div>
              <div className="mh-stat__label">Box Office</div>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="mh-section mh-origin">
        <div className="mh-section__inner">
          <div className="mh-section__header">
            <span className="mh-section__tag">The Beginning</span>
            <h2 className="mh-section__title">How Marvel Started</h2>
          </div>
          <div className="mh-origin__grid">
            <div className="mh-origin__text">
              <p>
                In <strong>1939</strong>, pulp magazine publisher <strong>Martin Goodman</strong> saw the
                explosive success of DC's Action Comics #1 (which introduced Superman) and decided to enter
                the nascent comic book industry. He founded <strong>Timely Publications</strong> and launched
                <strong> Marvel Comics #1</strong> in October 1939.
              </p>
              <p>
                The issue featured the <em>Human Torch</em> (an android) and <em>Namor the Sub-Mariner</em>
                — two of Marvel's very first superheroes. It sold nearly <strong>900,000 copies</strong>,
                proving there was an enormous appetite for superhero stories.
              </p>
              <p>
                Throughout the 1940s, Timely published dozens of titles including the beloved
                <strong> Captain America</strong>. The company went through several identity shifts — from
                Timely to <strong>Atlas Comics</strong> in the 1950s — before finally becoming
                <strong> Marvel Comics</strong> in 1961, when Stan Lee and Jack Kirby launched the
                <strong> Fantastic Four</strong> and ignited the Marvel Age of Comics.
              </p>
            </div>
            <div className="mh-origin__highlight">
              <div className="mh-origin__comic-card">
                <div className="mh-origin__comic-cover">
                  <div className="mh-origin__comic-icon">🔥</div>
                  <div className="mh-origin__comic-label">Marvel Comics #1</div>
                  <div className="mh-origin__comic-date">October 1939</div>
                </div>
                <div className="mh-origin__comic-info">
                  <p>The issue that started it all. Featuring the Human Torch and Sub-Mariner, it sold nearly 900,000 copies — launching a legacy that would span nearly nine decades.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="mh-section mh-founder">
        <div className="mh-section__inner">
          <div className="mh-section__header">
            <span className="mh-section__tag">The Founder</span>
            <h2 className="mh-section__title">Martin Goodman</h2>
          </div>
          <div className="mh-founder__grid">
            <div className="mh-founder__portrait">
              <div className="mh-founder__portrait-inner">
                <div className="mh-founder__portrait-initial">MG</div>
                <div className="mh-founder__portrait-glow" />
              </div>
              <div className="mh-founder__portrait-ring" />
            </div>
            <div className="mh-founder__details">
              <div className="mh-founder__bio-grid">
                <div className="mh-founder__bio-item">
                  <span className="mh-founder__bio-label">Born</span>
                  <span className="mh-founder__bio-value">January 18, 1908</span>
                </div>
                <div className="mh-founder__bio-item">
                  <span className="mh-founder__bio-label">Died</span>
                  <span className="mh-founder__bio-value">June 6, 1992</span>
                </div>
                <div className="mh-founder__bio-item">
                  <span className="mh-founder__bio-label">Age at Death</span>
                  <span className="mh-founder__bio-value">84 years</span>
                </div>
                <div className="mh-founder__bio-item">
                  <span className="mh-founder__bio-label">Active Years</span>
                  <span className="mh-founder__bio-value">1939 – 1968</span>
                </div>
              </div>
              <div className="mh-founder__text">
                <p>
                  Martin Goodman was a New York-born publisher who built a media empire through pulp magazines
                  before pivoting to comic books. His instinct for spotting popular trends led him to create
                  Timely Publications, the company that would become Marvel Comics.
                </p>
                <p>
                  Goodman ran the company for nearly 30 years before selling his stake in 1968. Though he
                  stepped away from the comics business, the foundation he built grew into one of the most
                  valuable entertainment brands in history.
                </p>
              </div>
            </div>
          </div>

          {/* Also honor Stan Lee & Jack Kirby */}
          <div className="mh-founder__legends">
            <h3 className="mh-founder__legends-title">The Legends Who Built the Universe</h3>
            <div className="mh-founder__legends-grid">
              <div className="mh-founder__legend">
                <div className="mh-founder__legend-avatar">SL</div>
                <div className="mh-founder__legend-info">
                  <h4>Stan Lee</h4>
                  <p className="mh-founder__legend-dates">December 28, 1922 – November 12, 2018 (aged 95)</p>
                  <p>Editor-in-Chief, writer, and creative visionary. Co-created Spider-Man, X-Men, Avengers, Hulk, Thor, Iron Man, and hundreds more. Turned Marvel into a cultural phenomenon.</p>
                </div>
              </div>
              <div className="mh-founder__legend">
                <div className="mh-founder__legend-avatar">JK</div>
                <div className="mh-founder__legend-info">
                  <h4>Jack Kirby</h4>
                  <p className="mh-founder__legend-dates">August 28, 1917 – February 6, 1994 (aged 76)</p>
                  <p>"The King of Comics." Co-created the Fantastic Four, X-Men, Avengers, Hulk, Thor, Captain America (with Joe Simon), and designed the cosmic cosmic visual language of the Marvel Universe.</p>
                </div>
              </div>
              <div className="mh-founder__legend">
                <div className="mh-founder__legend-avatar">SD</div>
                <div className="mh-founder__legend-info">
                  <h4>Steve Ditko</h4>
                  <p className="mh-founder__legend-dates">November 2, 1927 – June 29, 2018 (aged 90)</p>
                  <p>Co-created Spider-Man and Doctor Strange. His distinctive, psychedelic art style defined the visual identity of Marvel's weirdest and most wonderful characters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mh-section mh-timeline-section">
        <div className="mh-section__inner">
          <div className="mh-section__header mh-section__header--center">
            <span className="mh-section__tag">Milestones</span>
            <h2 className="mh-section__title">Marvel Through the Ages</h2>
          </div>
          <div className="timeline">
            <div className="timeline__line" />
            {MILESTONES.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Current Leadership */}
      <section className="mh-section mh-leadership">
        <div className="mh-section__inner">
          <div className="mh-section__header mh-section__header--center">
            <span className="mh-section__tag">Leadership</span>
            <h2 className="mh-section__title">Marvel Studios Today</h2>
            <p className="mh-section__subtitle-text">
              The team steering the Marvel Cinematic Universe into the future
            </p>
          </div>
          <div className="leadership-grid">
            {LEADERSHIP.map((member, i) => (
              <LeadershipCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Years Counter Footer */}
      <section className="mh-section mh-years">
        <div className="mh-section__inner">
          <div className="mh-years__content">
            <div className="mh-years__number">
              <AnimatedNumber target={marvelAge} duration={2500} />
            </div>
            <div className="mh-years__label">
              Years of Marvel — and counting
            </div>
            <p className="mh-years__text">
              From a single comic book in 1939 to a global entertainment empire spanning films, television,
              streaming, games, and merchandise. Marvel's legacy continues to grow with every new story told.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mh-footer">
        <div className="mh-footer__inner">
          <button className="mh-footer__back" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <p className="mh-footer__credit">
            Marvel and all related characters © Marvel Entertainment
          </p>
        </div>
      </footer>
    </div>
  );
}
