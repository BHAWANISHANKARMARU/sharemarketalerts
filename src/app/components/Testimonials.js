import Image from "next/image";
import styles from "./Testimonials.module.css";

const metrics = [
  { icon: "star", value: "4.9/5", label: <>average rating</> },
  { icon: "people", value: "25,000+", label: <>active traders</> },
  { icon: "bell", value: "1.2M+", label: <>alerts delivered</> },
  {
    icon: "repeat",
    value: "92%",
    label: (
      <>
        users continue
        <br />
        trading with us
      </>
    ),
  },
];

function MetricIcon({ name }) {
  if (name === "star") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="m16 3.6 3.8 7.7 8.5 1.2-6.1 6 1.4 8.4-7.6-4-7.6 4 1.4-8.4-6.1-6 8.5-1.2L16 3.6Z" />
      </svg>
    );
  }

  if (name === "people") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle cx="12" cy="10.5" r="4" />
        <circle cx="22.5" cy="12" r="3.2" />
        <path d="M4.5 26v-2.2c0-4.2 3.4-7.6 7.6-7.6s7.6 3.4 7.6 7.6V26H4.5Zm15-7.7c.9-.6 2-.9 3.2-.9 3.3 0 5.9 2.6 5.9 5.9V26h-5.7" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M7.2 23.4h17.6l-2.3-3.1V14a6.5 6.5 0 0 0-13 0v6.3l-2.3 3.1Z" />
        <path d="M13.2 26.2a3 3 0 0 0 5.6 0M16 4.4V2.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M25.7 11.2A10.4 10.4 0 0 0 7.2 8.8L5 11.1" />
      <path d="M5.1 5.8v5.5h5.5M6.3 20.8a10.4 10.4 0 0 0 18.5 2.4l2.2-2.3" />
      <path d="M26.9 26.2v-5.5h-5.5" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className={styles.section}
      data-section="testimonials"
      aria-labelledby="testimonials-title"
    >
      <div className={styles.canvas}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>TESTIMONIALS</p>
          <h2 id="testimonials-title">
            <span>Why serious traders</span>
            <em>stay with ShareMarketAlerts.</em>
          </h2>
          <p className={styles.intro}>
            Traders rely on us for IPO GMP clarity, real-time alerts,
            <br />
            {" "}
            and the confidence to act before the market moves.
          </p>
        </header>

        <div className={styles.artwork}>
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_09 AM.png"
            alt=""
            width={1024}
            height={1536}
            className={styles.arch}
            aria-hidden="true"
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_47_43 AM.png"
            alt=""
            width={1536}
            height={1024}
            className={styles.platform}
            aria-hidden="true"
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_36 AM.png"
            alt="Rohit Mehta says ShareMarketAlerts makes IPO GMP easy to understand and helps him catch strong listing gains."
            width={1536}
            height={1024}
            className={styles.rohitCard}
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_25 AM.png"
            alt="Anjali Desai says the real-time alerts are incredibly fast and accurate."
            width={1024}
            height={1536}
            className={styles.anjaliCard}
            unoptimized
          />
          <Image
            src="/images/ChatGPT Image Aug 4, 2026, 12_48_53 AM.png"
            alt="Testimonials from Karan Malhotra and Vivek Narayan about accurate GMP updates and reliable IPO research."
            width={1024}
            height={1536}
            className={styles.noteCards}
            unoptimized
          />
        </div>

        <ul className={styles.metrics} aria-label="Trader trust statistics">
          {metrics.map((metric) => (
            <li key={metric.value}>
              <span className={styles.metricIcon}>
                <MetricIcon name={metric.icon} />
              </span>
              <span className={styles.metricCopy}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
