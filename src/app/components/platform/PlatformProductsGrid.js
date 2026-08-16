import Link from "next/link";
import s from "./PlatformProductsGrid.module.css";

const ICONS = {
  CH: <><path d="M7 31V15m10 22V8m10 24V12m10 17V6" /><path d="M3 23h8m2-7h8m2 9h8m2-10h8" /></>,
  SC: <><path d="M5 7h34L27 21v14l-8 4V21L5 7Z" /><path d="M33 34h6" /></>,
  HM: <>{[6,18,30].flatMap((x) => [6,18,30].map((y) => <rect x={x} y={y} width="9" height="9" rx="1" key={`${x}-${y}`} />))}</>,
  CA: <><rect x="6" y="9" width="32" height="29" rx="3" /><path d="M13 5v8m18-8v8M6 17h32" /><path d="m15 27 5 5 10-11" /></>,
  RS: <><rect x="8" y="5" width="28" height="34" rx="3" /><path d="M15 14h14M15 21h14M15 28h10" /></>,
  AL: <><path d="M9 32h30c-4-3-4-8-4-14a11 11 0 0 0-22 0c0 6 0 11-4 14Z" /><path d="M19 38c2 3 8 3 10 0M24 5V2" /></>,
};

const TRUST = [
  ["Reliable data", "Multiple sources with continuous validation.", "shield"],
  ["Real-time updates", "Signals, prices and events as they happen.", "clock"],
  ["Custom workflows", "Use tools individually or combine them together.", "sliders"],
  ["Secure by design", "Enterprise-grade infrastructure and data protection.", "lock"],
];

function TrustIcon({ name }) {
  if (name === "shield") return <><path d="M12 2 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-4Z" /><path d="m8 12 3 3 5-7" /></>;
  if (name === "clock") return <><circle cx="12" cy="12" r="9" /><path d="M12 6v7l4 2" /></>;
  if (name === "sliders") return <><path d="M3 6h18M3 12h18M3 18h18" /><circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="8" cy="18" r="2" /></>;
  return <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>;
}

export default function PlatformProductsGrid({ categories }) {
  return (
    <section className={s.section} data-platform-products="true" aria-labelledby="platform-products-title">
      <header><div><span>PLATFORM PRODUCTS</span><h2 id="platform-products-title">All platform products</h2><p>Complete market coverage organised by the job you need to do</p></div><Link href="/live-markets">Launch workspace <span>↗</span></Link></header>
      <div className={s.grid}>{categories.map(([title, copy, items, route, mark]) => <article data-platform-product-card="true" key={title}>
        <header><span className={s.icon}><svg viewBox="0 0 44 44" aria-hidden="true">{ICONS[mark]}</svg></span><div><h3>{title}</h3><p>{copy}</p></div><Link href={route} aria-label={`Open ${title}`}>↗</Link></header>
        <ol>{items.map((item, index) => <li key={item}><span>0{index + 1}</span><strong>{item}</strong><em>Included <b>✓</b></em></li>)}</ol>
      </article>)}</div>
      <div className={s.trust} data-platform-trust-strip="true">{TRUST.map(([title, copy, icon]) => <div data-platform-trust-item="true" key={title}><svg viewBox="0 0 24 24" aria-hidden="true"><TrustIcon name={icon} /></svg><p><strong>{title}</strong><span>{copy}</span></p></div>)}</div>
    </section>
  );
}
