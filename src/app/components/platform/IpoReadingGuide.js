import s from "./IpoReadingGuide.module.css";

const GUIDE_ITEMS = [
  ["01", "Demand", "Separate institutional, non-institutional and retail bids.", "demand"],
  ["02", "Valuation", "Compare the upper band with relevant listed peers.", "valuation"],
  ["03", "Proceeds", "Distinguish growth capital from shareholder exits.", "proceeds"],
  ["04", "Risk", "Review leverage, concentration and litigation disclosures.", "risk"],
];

function GuideIcon({ name }) {
  if (name === "demand") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="14" r="5" /><circle cx="14" cy="19" r="4" /><circle cx="34" cy="19" r="4" /><path d="M15 37v-4c0-5 4-9 9-9s9 4 9 9v4M5 34v-3c0-4 3-7 7-7 2 0 4 .8 5.2 2.2M43 34v-3c0-4-3-7-7-7-2 0-4 .8-5.2 2.2" /></svg>;
  if (name === "valuation") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 37h7V26H8v11Zm13 0h7V17h-7v20Zm13 0h7V8h-7v29Z" /></svg>;
  if (name === "proceeds") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" /><path d="M24 6v18h18M24 24 12 37M24 24l15 10" /></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5c6 5 12 6 17 7v11c0 7-4 13-10 17M24 5c-6 5-12 6-17 7v11c0 9 7 16 17 20" /><path d="m35 24 9 16H26l9-16Zm0 5v5m0 3v.2" /></svg>;
}

export default function IpoReadingGuide() {
  return (
    <section className={s.guide} data-ipo-reading-guide="true" aria-labelledby="ipo-reading-guide-title">
      <div className={s.intro}>
        <span className={s.eyebrow} aria-hidden="true"><i /></span>
        <h2 id="ipo-reading-guide-title">Read the issue,<br />not only the<br />premium</h2>
        <span className={s.rule} aria-hidden="true" />
        <p>GMP reflects informal demand. It does not measure valuation, allocation probability or post-listing liquidity.</p>
      </div>

      <ol className={s.cards}>
        {GUIDE_ITEMS.map(([number, title, copy, icon]) => (
          <li className={s.card} data-ipo-reading-card="true" key={number}>
            <span className={s.number}>{number}</span>
            <span className={s.numberRule} aria-hidden="true" />
            <span className={s.icon} data-ipo-reading-icon="true"><GuideIcon name={icon} /></span>
            <h3>{title}</h3>
            <span className={s.cardRule} aria-hidden="true" />
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
