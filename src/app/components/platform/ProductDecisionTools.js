import Link from "next/link";
import s from "./ProductDecisionTools.module.css";

const TOOL_ICONS = {
  "Market Lens": <><circle cx="20" cy="20" r="12" /><path d="m29 29 9 9M13 22l5-6 4 4 6-8" /><path d="m25 12 3 .2-.2 3" /></>,
  "Signal Engine": <><path d="M8 35v-8m9 8V20m9 15V14m9 21V8" /><path d="m7 19 9-9 8 6 12-12m-7 0h7v7" /></>,
  "IPO Desk": <><rect x="7" y="8" width="30" height="31" rx="3" /><path d="M7 18h30M20 18v21m4-14h8m-8 6h5" /><circle cx="14" cy="26" r="2" /></>,
  "Alert Router": <><path d="M10 32h28c-4-3-4-8-4-14a10 10 0 0 0-20 0c0 6 0 11-4 14Z" /><path d="M19 37c1 4 9 4 10 0M24 5V2" /></>,
};

const DISPLAY_INPUTS = {
  "Market Lens": ["Live prices", "Breadth", "Sector strength"],
  "Signal Engine": ["Price action", "Volume", "Trend state"],
  "IPO Desk": ["Issue terms", "Demand", "GMP context"],
  "Alert Router": ["Condition builder", "Smart routing", "Channel delivery"],
};

export default function ProductDecisionTools({ tools }) {
  return (
    <section className={s.section} data-product-decision-tools="true" aria-labelledby="decision-tools-title">
      <header>
        <div><span>PRODUCTS</span><h2 id="decision-tools-title">Built around the decision</h2><p>Four tools, one continuous workflow</p></div>
        <div className={s.filters} aria-label="Product filter"><button type="button" aria-pressed="true">All capabilities</button><button type="button">For traders</button><button type="button">For investors</button></div>
      </header>
      <div className={s.rows}>
        {tools.map((tool, index) => <article data-decision-tool="true" key={tool.name}>
          <span className={s.number}>0{index + 1}</span>
          <span className={s.icon}><svg viewBox="0 0 44 44" aria-hidden="true">{TOOL_ICONS[tool.name]}</svg></span>
          <div className={s.copy}><h3>{tool.name}</h3><p>{tool.description}</p></div>
          <div className={s.tags}>{DISPLAY_INPUTS[tool.name].map((input, inputIndex) => <span key={input}>{input}{inputIndex < 2 ? <i aria-hidden="true" /> : null}</span>)}</div>
          <Link href={tool.route}>Explore <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
    </section>
  );
}
