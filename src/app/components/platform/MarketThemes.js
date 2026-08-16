import s from "./MarketThemes.module.css";

const THEMES = [
  ["01", "Broadening leadership", "Banks, autos and industrials are sharing index leadership.", "Constructive", "leadership"],
  ["02", "Compressed volatility", "Low implied volatility leaves less room for weak execution.", "Watch", "volatility"],
  ["03", "Primary-market demand", "Issue quality matters more as GMP dispersion widens.", "Selective", "primary"],
  ["04", "Global technology", "Overnight strength supports domestic IT, but currency matters.", null, "technology"],
];

function ThemeIcon({ name }) {
  if (name === "leadership") return <><rect x="8" y="8" width="28" height="28" rx="2" /><path d="m13 28 6-7 5 4 7-10" /><path d="m27 15 4-.2-.2 4" /></>;
  if (name === "volatility") return <><path d="M7 24h4l2-8 4 17 4-23 4 28 4-20 3 10h5" /><path d="M5 12v24M39 12v24" /></>;
  if (name === "primary") return <><rect x="7" y="9" width="30" height="28" rx="3" /><path d="M7 18h30M14 5v8m16-8v8M14 25h6m-6 6h15" /></>;
  return <><rect x="10" y="10" width="24" height="24" rx="3" /><path d="M16 16h12v12H16zM4 19h6m24 0h6M4 25h6m24 0h6M19 4v6m6-6v6m-6 24v6m6-6v6" /></>;
}

export default function MarketThemes() {
  return (
    <section className={s.section} data-market-themes="true" aria-labelledby="market-themes-title">
      <header><h2 id="market-themes-title">Market themes</h2><p>What the research desk is tracking now</p></header>
      <div className={s.grid}>
        {THEMES.map(([number, title, copy, status, icon]) => <article data-market-theme="true" key={number}>
          <span className={s.number}>{number}</span>
          <span className={s.icon}><svg viewBox="0 0 44 44" aria-hidden="true"><ThemeIcon name={icon} /></svg></span>
          <div><h3>{title}</h3><p>{copy}</p></div>
          {status ? <span className={s.status} data-theme-status="true" data-status={status}>{status}</span> : null}
        </article>)}
      </div>
    </section>
  );
}
