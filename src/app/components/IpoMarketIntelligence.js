"use client";

import { useMarketData } from "./MarketDataProvider";
import s from "./IpoMarketIntelligence.module.css";

const numberFormat = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function dateParts(value) {
  const date = new Date(value);
  return {
    date: new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(date),
    day: new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" }).format(date),
    time: new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(date),
  };
}

function valueOrDash(value, suffix = "") {
  return value === null || value === undefined ? "—" : `${numberFormat.format(value)}${suffix}`;
}

function Icon({ name, className }) {
  const common = {
    className,
    viewBox: "0 0 48 48",
    "aria-hidden": "true",
  };

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="9" y="12" width="30" height="27" rx="4" />
        <path d="M9 20h30M17 8v8M31 8v8" />
        <path d="M16 26h4M24 26h4M32 26h1M16 32h4M24 32h4M32 32h1" />
      </svg>
    );
  }

  if (name === "building") {
    return (
      <svg {...common}>
        <path d="M11 39V18h11v21M22 39V9h15v30M7 39h34" />
        <path d="M16 23h2M16 29h2M16 35h2M28 15h4M28 21h4M28 27h4M28 33h4" />
        <path d="M27 9V5h6v4" />
      </svg>
    );
  }

  if (name === "trend") {
    return (
      <svg {...common}>
        <path d="m8 35 12-12 8 7 13-15" />
        <path d="M31 15h10v10" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="17" />
        <path d="M24 13v12l8 5" />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg {...common}>
        <path d="M7 10h12c3 0 5 2 5 5v25c0-3-2-5-5-5H7V10ZM41 10H29c-3 0-5 2-5 5v25c0-3 2-5 5-5h12V10Z" />
        <path d="M12 17h7M12 23h7M29 17h7M29 23h7" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="m24 6 15 6v11c0 10-6 16-15 20-9-4-15-10-15-20V12l15-6Z" />
        <path d="m18 24 4 4 8-9" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="24" cy="24" r="19" />
      <path d="M14 32v-7h5v7M22 32V19h5v13M30 32V13h5v19" />
    </svg>
  );
}

function KpiCard({ card }) {
  return (
    <article className={s.kpiCard}>
      <span className={`${s.kpiIcon} ${s[card.tone]}`}>
        <Icon name={card.icon} />
      </span>
      <span className={s.kpiDivider} aria-hidden="true" />
      <div className={s.kpiCopy}>
        <p>{card.label}</p>
        <strong className={card.icon === "trend" ? s.greenValue : undefined}>{card.value}</strong>
        <span>{card.detail}</span>
      </div>
    </article>
  );
}

function TrackerTable({ rows, fallbackUpdatedAt }) {
  return (
    <div className={s.tableShell}>
      <table className={s.trackerTable}>
        <colgroup>
          <col className={s.companyColumn} />
          <col className={s.sizeColumn} />
          <col className={s.issueColumn} />
          <col className={s.gmpColumn} />
          <col className={s.percentColumn} />
          <col className={s.listingColumn} />
          <col className={s.gainColumn} />
          <col className={s.updatedColumn} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"><span className={s.companyHeading}><Icon name="building" />Company Name</span></th>
            <th scope="col">IPO Size<br />(₹ Cr)</th>
            <th scope="col">Issue Price<br />(₹)</th>
            <th scope="col">GMP<br />(₹)</th>
            <th scope="col">GMP %<br />(%)</th>
            <th scope="col">Estimated Listing Price<br />(₹)</th>
            <th scope="col">Expected Listing Gain<br />(%)</th>
            <th scope="col">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const resultClass = row.gmp !== null && row.gmp < 0 ? s.negative : s.positive;
            const updated = dateParts(row.updatedAt || fallbackUpdatedAt);
            const issue = row.issueLow === null ? "—" : `${numberFormat.format(row.issueLow)} – ${numberFormat.format(row.issueHigh)}`;
            return (
              <tr key={row.company}>
                <td data-label="Company Name"><a href={row.href} target="_blank" rel="noreferrer"><strong>{row.company}</strong></a></td>
                <td data-label="IPO Size (₹ Cr)">{valueOrDash(row.issueSize)}</td>
                <td data-label="Issue Price (₹)">{issue}</td>
                <td data-label="GMP (₹)" className={resultClass}>{valueOrDash(row.gmp)}</td>
                <td data-label="GMP (%)" className={resultClass}>{valueOrDash(row.gmpPercent, "%")}</td>
                <td data-label="Estimated Listing Price (₹)" className={resultClass}>{valueOrDash(row.estimatedListingPrice)}</td>
                <td data-label="Expected Listing Gain (%)" className={resultClass}>{valueOrDash(row.expectedListingGain, "%")}</td>
                <td data-label="Last Updated" className={s.updated}>{updated.date}<br />{updated.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function InfoCard({ icon, title, children, tone }) {
  return (
    <article className={s.infoCard}>
      <span className={`${s.infoIcon} ${s[tone]}`}><Icon name={icon} /></span>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

export default function IpoMarketIntelligence() {
  const marketData = useMarketData();
  const report = dateParts(marketData.ipo.updatedAt);
  const highest = marketData.ipo.highestGmp;
  const kpiCards = [
    { icon: "building", label: "TOTAL IPOS TRACKED", value: String(marketData.ipo.total), detail: "Companies", tone: "mint" },
    { icon: "trend", label: "HIGHEST GMP %", value: valueOrDash(highest?.gmpPercent, "%"), detail: highest?.company || "GMP data unavailable", tone: "mint" },
    { icon: "clock", label: "LAST UPDATE", value: `${report.date}, ${report.time}`, detail: report.day, tone: "blue" },
  ];

  return (
    <section
      id="ipo-gmp-tracker"
      data-section="ipo-gmp-tracker"
      data-ipo-source={marketData.sources.ipo.mode}
      className={s.section}
      aria-labelledby="ipo-market-intelligence-title"
    >
      <div className={s.canvas}>
        <header className={s.header}>
          <h2 id="ipo-market-intelligence-title">IPO GMP Tracker</h2>
          <p>Grey Market Premium Overview</p>
          <span className={s.titleRule} aria-hidden="true" />
        </header>

        <div className={s.datePanel} aria-label="Report date and time">
          <span className={s.calendarIcon}><Icon name="calendar" /></span>
          <div className={s.dateCopy}><strong>{report.date}</strong><span>{report.day}</span></div>
          <span className={s.dateDivider} aria-hidden="true" />
          <strong className={s.time}>{report.time}</strong>
        </div>

        <div className={s.kpiGrid} aria-label="IPO summary">
          {kpiCards.map((card) => <KpiCard card={card} key={card.label} />)}
        </div>

        <TrackerTable rows={marketData.ipo.rows} fallbackUpdatedAt={marketData.ipo.updatedAt} />

        <div className={s.infoGrid}>
          <InfoCard icon="book" title="WHAT IS GMP?" tone="mint">
            Grey Market Premium (GMP) is the unofficial premium at which IPO<br />{" "}
            shares are trading in the grey market before listing.
          </InfoCard>
          <InfoCard icon="shield" title="DISCLAIMER" tone="blue">
            GMP is not regulated by any authority. It is subject to market risks.<br />{" "}
            Please invest only after your own research and due diligence.
          </InfoCard>
        </div>

        <footer className={s.sourceBar} aria-label="IPO data source">
          <span className={s.sourceIcon}><Icon name="source" /></span>
          <strong>Source:</strong>
          <span>IPO Alerts{marketData.ipo.partial ? " · partial live coverage plus clearly marked historical fallback" : " · live API"}</span>
          <i aria-hidden="true" />
          <span>Data as on {report.date}, {report.time}</span>
          <span className={s.sourceWave} aria-hidden="true" />
        </footer>
      </div>
    </section>
  );
}
