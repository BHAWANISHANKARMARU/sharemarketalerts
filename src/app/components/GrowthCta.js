"use client";

import { useState } from "react";
import styles from "./GrowthCta.module.css";

const benefits = [
  {
    icon: "trend",
    title: "Data-Backed Insights",
    copy: "Make Smarter Decisions",
  },
  {
    icon: "shield",
    title: "Proven SEO Strategies",
    copy: "That Drive Results",
  },
  {
    icon: "rocket",
    title: "Unmatched Support",
    copy: "We're with you all the way",
  },
];

const assurances = [
  "No Credit Card Required",
  "7-Day Free Trial",
  "Cancel Anytime",
  "Setup in 1 Minute",
];

const trustBrands = [
  "Razorpay",
  "CRED",
  "lenskart",
  "zomato",
  "upstox",
  "ZERODHA",
];

const avatars = [
  { skin: "#c77856", shirt: "#8f22f6", hair: "#2d1720" },
  { skin: "#d5906d", shirt: "#137c9c", hair: "#302219" },
  { skin: "#b86b4a", shirt: "#bb552b", hair: "#141117" },
  { skin: "#e0a07b", shirt: "#127767", hair: "#5d2d24" },
  { skin: "#b97959", shirt: "#4059b8", hair: "#24181a" },
];

function Icon({ name, className }) {
  let content;

  switch (name) {
    case "bolt":
      content = <path d="m18.5 2.8-10 15.1h7l-2 11.3 10-15.4h-7l2-11Z" />;
      break;
    case "trend":
      content = (
        <>
          <path d="m5 23 7-7 4.8 4.2L27 9" />
          <path d="M20.7 9H27v6.3" />
        </>
      );
      break;
    case "shield":
      content = (
        <>
          <path d="M16 3.5c3.5 2.6 6.5 3.7 10 4v7.8c0 6.3-3.3 10.6-10 13.2-6.7-2.6-10-6.9-10-13.2V7.5c3.5-.3 6.5-1.4 10-4Z" />
          <path d="m11.4 16 3 3 6.3-6.4" />
        </>
      );
      break;
    case "rocket":
      content = (
        <>
          <path d="M12.2 19.8c-1.6.2-3.7 1-5 2.2-.6-2.2 0-4.3 1.9-6.2l3.1 4Z" />
          <path d="M11.7 12.8c3.6-3.6 8.9-5.8 15.9-6.3-.4 7-2.6 12.3-6.2 15.9l-9.7-9.6Z" />
          <circle cx="21.2" cy="12.3" r="2.2" />
          <path d="m14 20.2-5.5 5.5" />
        </>
      );
      break;
    case "spark":
      content = <path d="M16 3.5c.8 6.8 3.7 9.7 10.5 10.5C19.7 14.8 16.8 17.7 16 24.5 15.2 17.7 12.3 14.8 5.5 14 12.3 13.2 15.2 10.3 16 3.5Z" />;
      break;
    case "check":
      content = (
        <>
          <circle cx="16" cy="16" r="10.4" />
          <path d="m11.3 16 3.1 3.1 6.4-6.4" />
        </>
      );
      break;
    case "arrow":
      content = (
        <>
          <path d="M3 8h14" />
          <path d="m13 4 4 4-4 4" />
        </>
      );
      break;
    case "trust-shield":
      content = (
        <>
          <path d="M16 2.7c4 3 7.4 4.2 11.5 4.5v8.7c0 7.1-3.8 12-11.5 15-7.7-3-11.5-7.9-11.5-15V7.2c4.1-.3 7.5-1.5 11.5-4.5Z" />
          <path d="m11.3 16.4 3.2 3.2 6.7-6.8" />
        </>
      );
      break;
    default:
      content = null;
  }

  return (
    <svg
      viewBox={name === "arrow" ? "0 0 20 16" : "0 0 32 32"}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}

function BrandMark({ brand }) {
  if (brand === "Razorpay") {
    return (
      <span className={styles.razorpay}>
        <i aria-hidden="true" />
        <em>Razorpay</em>
      </span>
    );
  }

  if (brand === "CRED") {
    return (
      <span className={styles.cred}>
        <i aria-hidden="true">C</i>
        <strong>CRED</strong>
      </span>
    );
  }

  if (brand === "lenskart") {
    return (
      <span className={styles.lenskart}>
        <svg viewBox="0 0 40 16" aria-hidden="true" focusable="false">
          <path d="M20 8c-3.5-5-6.2-7-10-7a7 7 0 1 0 0 14c3.8 0 6.5-2 10-7Zm0 0c3.5 5 6.2 7 10 7a7 7 0 1 0 0-14c-3.8 0-6.5 2-10 7Z" />
        </svg>
        <strong>lenskart</strong>
      </span>
    );
  }

  if (brand === "ZERODHA") {
    return (
      <span className={styles.zerodha}>
        <i aria-hidden="true" />
        <strong>ZERODHA</strong>
      </span>
    );
  }

  return <strong className={styles.wordmark}>{brand}</strong>;
}

export default function GrowthCta() {
  const [status, setStatus] = useState("");

  function handleTrialSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const email = new FormData(form).get("email");
    setStatus("Opening your secure trial request…");
    const signupUrl = process.env.NEXT_PUBLIC_SIGNUP_URL;
    if (signupUrl) {
      const url = new URL(signupUrl, window.location.origin);
      url.searchParams.set("email", email);
      window.location.assign(url.toString());
      return;
    }
    window.location.href = `mailto:sales@sharemarketalerts.com?subject=${encodeURIComponent("Start my ShareMarketAlerts free trial")}&body=${encodeURIComponent(`Please start a free trial for ${email}.`)}`;
  }

  return (
    <section
      id="growth-cta"
      className={styles.section}
      data-section="growth-cta"
      aria-labelledby="growth-cta-title"
    >
      <div className={styles.canvas}>
        <div className={styles.leftContours} aria-hidden="true" />
        <div className={styles.rightContours} aria-hidden="true" />

        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <Icon name="bolt" />
            <span>READY TO GROW?</span>
          </p>
          <h2 id="growth-cta-title">
            <span>Stop guessing.</span>
            <strong>Start growing.</strong>
          </h2>
          <svg
            viewBox="0 0 120 22"
            className={styles.headlineUnderline}
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 15c29-4 61-7 103-5" />
            <path d="m94 4 14 6-15 6" />
          </svg>
          <p className={styles.intro}>
            Join thousands of marketers and businesses who use ShareMarketAlerts
            <br />
            {" "}
            to get more visibility, traffic, and real results.
          </p>
        </header>

        <ul className={styles.benefits} aria-label="Growth advantages">
          {benefits.map((benefit) => (
            <li key={benefit.title}>
              <span className={styles.benefitIcon}>
                <Icon name={benefit.icon} />
              </span>
              <span className={styles.benefitCopy}>
                <strong>{benefit.title}</strong>
                <span>{benefit.copy}</span>
              </span>
            </li>
          ))}
        </ul>

        <div
          className={styles.resultSeal}
          aria-label="100 percent real data and real results"
        >
          <span className={styles.sealTop}>REAL DATA</span>
          <span className={styles.sealSideLeft}>◆</span>
          <strong>100%</strong>
          <span className={styles.sealSideRight}>◆</span>
          <span className={styles.sealBottom}>REAL RESULTS</span>
        </div>

        <div className={styles.signupPanel}>
          <div className={styles.panelHeadline}>
            <p>
              <Icon name="spark" />
              <span>START YOUR JOURNEY TODAY</span>
            </p>
            <h3>
              <span>Get Started in</span>
              <span>
                <strong>60</strong> Seconds
              </span>
            </h3>
            <svg
              viewBox="0 0 80 18"
              className={styles.sixtyUnderline}
              aria-hidden="true"
              focusable="false"
            >
              <path d="M3 12c23-4 46-5 70-4M5 16c19-3 35-3 52-2" />
            </svg>
          </div>

          <div className={styles.panelDivider} aria-hidden="true" />

          <ul className={styles.assurances} aria-label="Trial assurances">
            {assurances.map((assurance) => (
              <li key={assurance} data-assurance={assurance}>
                <Icon name="check" />
                <span>{assurance}</span>
              </li>
            ))}
          </ul>

          <form className={styles.trialForm} aria-label="Start free trial" onSubmit={handleTrialSubmit}>
            <label htmlFor="growth-work-email" className={styles.srOnly}>
              Work email
            </label>
            <input
              id="growth-work-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your work email"
            />
            <button type="submit">
              <span>Start My Free Trial</span>
              <Icon name="arrow" />
            </button>
            <span className={styles.srOnly} role="status" aria-live="polite">{status}</span>
          </form>

          <div className={styles.socialProof}>
            <span className={styles.avatars} aria-hidden="true">
              {avatars.map((avatar, index) => (
                <i
                  key={index}
                  style={{
                    "--avatar-skin": avatar.skin,
                    "--avatar-shirt": avatar.shirt,
                    "--avatar-hair": avatar.hair,
                  }}
                />
              ))}
            </span>
            <span>Trusted by 2,500+ businesses worldwide</span>
          </div>
        </div>

        <div className={styles.trustRail}>
          <div className={styles.trustIntro}>
            <span className={styles.trustShield}>
              <Icon name="trust-shield" />
            </span>
            <span>
              <strong>Trusted by industry leaders</strong>
              <small>Powering growth for 2,500+ companies</small>
            </span>
          </div>

          <ul className={styles.brandList} aria-label="Trusted companies">
            {trustBrands.map((brand) => (
              <li key={brand} data-trust-brand={brand}>
                <BrandMark brand={brand} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
