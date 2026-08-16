import Link from "next/link";
import s from "./InsightsLearningLibrary.module.css";

const GUIDES = [
  {
    number: "01",
    tone: "green",
    title: "Reading market breadth",
    copy: "Understand how participation confirms—or contradicts—the index.",
    href: "/markets",
    icon: <><path d="M3 14h4l2-8 4 15 3-10h5" /></>,
  },
  {
    number: "02",
    tone: "purple",
    title: "Building a price alert",
    copy: "Turn a thesis into a condition, confirmation rule and delivery path.",
    href: "/stock-alerts",
    icon: <><circle cx="7" cy="7" r="2" /><circle cx="17" cy="7" r="2" /><rect x="3" y="13" width="8" height="7" rx="2" /><rect x="13" y="13" width="8" height="7" rx="2" /><path d="M12 5v6" /></>,
  },
  {
    number: "03",
    tone: "amber",
    title: "Comparing IPO demand",
    copy: "Separate issue terms, bidder categories, GMP and listing expectations.",
    href: "/ipo",
    icon: <><path d="m4 8 8-5 8 5-8 5-8-5Z" /><path d="m4 12 8 5 8-5M4 16l8 5 8-5" /></>,
  },
  {
    number: "04",
    tone: "blue",
    title: "Using a stock screener",
    copy: "Move from a broad universe to a ranked, reviewable opportunity queue.",
    href: "/live-markets",
    icon: <><path d="M3 18 8 11l4 3 7-9" /><path d="M16 5h3v3M3 21h18" /></>,
  },
];

export default function InsightsLearningLibrary() {
  return (
    <section className={s.section} data-insights-learning-library="true" aria-labelledby="learning-library-title">
      <div className={s.intro}>
        <span className={s.eyebrow}>Learning library</span>
        <h2 id="learning-library-title">Build a better market process</h2>
        <p>Short guides connect each workspace to the decision it is designed to support.</p>
        <div className={s.callout}>
          <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 18 9 12l4 3 7-8" /><path d="M15 7h5v5" /></svg></span>
          <i aria-hidden="true" />
          <strong>Sharpen your edge with battle-tested ideas and practical frameworks.</strong>
        </div>
      </div>
      <div className={s.grid}>
        {GUIDES.map((guide) => (
          <article className={s.card} data-learning-guide="true" data-tone={guide.tone} key={guide.title}>
            <header>
              <span>{guide.number}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">{guide.icon}</svg>
            </header>
            <h3>{guide.title}</h3>
            <p>{guide.copy}</p>
            <Link href={guide.href}>Open guide ↗</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
