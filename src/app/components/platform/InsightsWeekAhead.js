import Image from "next/image";
import Link from "next/link";
import styles from "./InsightsWeekAhead.module.css";

const EVENTS = [
  {
    weekday: "MON",
    day: "10",
    month: "JUN",
    title: "Industrial output",
    description: "Key indicator for manufacturing momentum and capacity utilisation.",
    impact: "Medium",
    tone: "violet",
    icon: "industry",
  },
  {
    weekday: "TUE",
    day: "11",
    month: "JUN",
    title: "Large-bank results",
    description: "Result season update from major banks across the index.",
    impact: "High",
    tone: "rose",
    icon: "bank",
  },
  {
    weekday: "THU",
    day: "13",
    month: "JUN",
    title: "CPI inflation",
    description: "Inflation print drives rate expectations and market liquidity.",
    impact: "High",
    tone: "orange",
    icon: "inflation",
  },
  {
    weekday: "FRI",
    day: "14",
    month: "JUN",
    title: "Weekly institutional flows",
    description: "Track domestic and FII flows across cash and derivatives.",
    impact: "Medium",
    tone: "violet",
    icon: "institution",
  },
];

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 10h18" />
    </svg>
  );
}

function EventGlyph({ name }) {
  if (name === "bank" || name === "institution") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 12 16 5l12 7H4Zm3 3v10m6-10v10m6-10v10m6-10v10M4 28h24" />
        {name === "institution" ? <path d="M10 12v-2m12 2v-2" /> : null}
      </svg>
    );
  }

  if (name === "inflation") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 27h25M7 25v-7h4v7m4 0V13h4v12m4 0V9h4v16" />
        <path d="m5 13 6-5 5 3 10-8m-5 0h5v5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 27h23M8 26V13l7-4v17m0-12 9-5v17M10 17h2m-2 4h2m7-7h2m-2 5h2m-2 5h2" />
      <path d="M20 8V4h4v3" />
    </svg>
  );
}

export default function InsightsWeekAhead() {
  return (
    <section className={styles.section} data-insights-week-ahead="true">
      <aside className={styles.intro}>
        <span className={styles.eyebrow}>TACTICAL CALENDAR <CalendarGlyph /></span>
        <h2>Week ahead</h2>
        <i className={styles.rule} aria-hidden="true" />
        <p>Events ranked by their capacity to change positioning.</p>
        <figure className={styles.illustration} aria-hidden="true">
          <Image
            src="/images/insights-tactical-calendar.png"
            alt=""
            width={1254}
            height={1254}
            sizes="(max-width: 760px) 70vw, 280px"
          />
        </figure>
      </aside>

      <div className={styles.schedule}>
        <ol className={styles.eventList}>
          {EVENTS.map((event) => (
            <li
              className={styles.eventCard}
              data-impact={event.impact}
              data-tactical-event="true"
              data-tone={event.tone}
              key={event.title}
            >
              <time className={styles.date} dateTime={`2026-06-${event.day}`}>
                <span>{event.weekday}</span>
                <strong>{event.day}</strong>
                <b>{event.month}</b>
              </time>
              <span className={styles.eventIcon}><EventGlyph name={event.icon} /></span>
              <div className={styles.eventCopy}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
              <aside className={styles.impact} aria-label={`${event.impact} impact`}>
                <span>{event.impact} impact</span>
                <i className={styles.impactMeter} aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((bar) => <b data-active={bar < (event.impact === "High" ? 4 : 2)} key={bar} />)}
                </i>
              </aside>
            </li>
          ))}
        </ol>

        <footer className={styles.footer}>
          <span className={styles.footerIcon}><CalendarGlyph /></span>
          <p><strong>Stay prepared</strong><small>Use the calendar to plan, not react.</small></p>
          <i aria-hidden="true" />
          <Link href="/markets#market-calendars">View full market calendar <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </section>
  );
}
