"use client";

import { useState } from "react";
import styles from "./Pricing.module.css";

const plans = [
  {
    key: "starter",
    icon: "rocket",
    label: "STARTER",
    title: "Launch Smart",
    description: <>Everything you need to get started<br />with SEO the right way.</>,
    monthlyPrice: 2499,
    features: ["Track 500 Keywords", "1 Project", "Daily Rank Tracking", "AI-Powered Insights", "Email Support"],
    cta: "Start Your Journey",
  },
  {
    key: "growth",
    icon: "trend",
    label: "GROWTH",
    title: "Grow Faster",
    description: <>Advanced tools to scale your visibility<br />and beat the competition.</>,
    monthlyPrice: 6999,
    features: ["Track 5,000 Keywords", "10 Projects", "Hourly Rank Tracking", "Competitor Intelligence", "AI Content & Gap Analyzer", "Priority Support"],
    cta: "Start 7-Day Free Trial",
    popular: true,
  },
  {
    key: "enterprise",
    icon: "crown",
    label: "ENTERPRISE",
    title: "Dominate Market",
    description: <>For large teams and agencies that<br />need more power and control.</>,
    monthlyPrice: 14999,
    features: ["Track 50,000+ Keywords", "Unlimited Projects", "Real-time Rank Tracking", "Advanced AI Suite", "White-label Reports", "Dedicated Account Manager", "24/7 Priority Support"],
    cta: "Talk to Sales",
  },
];

const benefits = [
  { icon: "infinity", title: "Unlimited Growth", copy: <>No limits on data history.<br />Scale without restrictions.</> },
  { icon: "shield", title: "Enterprise Security", copy: <>Your data is encrypted and<br />protected at every layer.</> },
  { icon: "bolt", title: "Blazing Fast Platform", copy: <>Real-time accuracy and speed<br />built for decision makers.</> },
  { icon: "headphones", title: "Human Support", copy: <>Real people. Real help.<br />Whenever you need it.</> },
  { icon: "bars", title: "Results That Matter", copy: <>Data-driven insights that turn<br />into real business growth.</> },
];

function Icon({ name, className }) {
  let content;

  switch (name) {
    case "rocket":
      content = (
        <>
          <path d="M12.1 19.9c-1.5.2-3.7.9-4.9 2.1-.7-2.1-.1-4.2 1.8-6.1l3.1 4Z" />
          <path d="M19.7 12.3c.3 1.9-.1 4.4-2.1 6.4l-5.9-5.9c2-2 4.5-2.4 6.4-2.1l4.5-4.5c1.4-1.4 3.4-2.1 5.3-1.8.3 1.9-.4 3.9-1.8 5.3l-6.4 2.6Z" />
          <circle cx="20.9" cy="10.2" r="2.1" />
          <path d="m12.7 18.5-4.4 4.4M10.4 21.1l-2.5 2.5" />
        </>
      );
      break;
    case "trend":
      content = <><path d="m5 24 7.3-8 5.3 4.5L27 9.6" /><path d="M20.9 9.6H27v6.1" /></>;
      break;
    case "crown":
      content = <><path d="m4 10 6.2 5 5.8-8 5.8 8 6.2-5-2.7 14H6.7L4 10Z" /><path d="M7.2 27h17.6" /></>;
      break;
    case "check":
      content = <><circle cx="16" cy="16" r="10.4" /><path d="m11.5 16 3 3 6-6" /></>;
      break;
    case "spark":
      content = <path d="M16 3.5c.9 6.8 3.7 9.6 10.5 10.5C19.7 14.9 16.9 17.7 16 24.5 15.1 17.7 12.3 14.9 5.5 14 12.3 13.1 15.1 10.3 16 3.5Z" />;
      break;
    case "infinity":
      content = <path d="M16 16c-2.6-4.2-4.9-6.3-7.4-6.3a6.3 6.3 0 0 0 0 12.6c2.5 0 4.8-2.1 7.4-6.3Zm0 0c2.6 4.2 4.9 6.3 7.4 6.3a6.3 6.3 0 0 0 0-12.6c-2.5 0-4.8 2.1-7.4 6.3Z" />;
      break;
    case "shield":
      content = <><path d="M16 3.5c3.4 2.7 6.4 3.8 10 4v7.9c0 6.2-3.3 10.5-10 13.1-6.7-2.6-10-6.9-10-13.1V7.5c3.6-.2 6.6-1.3 10-4Z" /><path d="m11.5 15.9 3 3 6.3-6.3" /></>;
      break;
    case "bolt":
      content = <path d="m18.8 2.8-10 15.4h7.1l-2.7 11 10-15.4h-7.1l2.7-11Z" />;
      break;
    case "headphones":
      content = <><path d="M5.2 17.3v-2.2a10.8 10.8 0 0 1 21.6 0v2.2" /><path d="M8.9 16.1H6.5c-1.4 0-2.5 1.1-2.5 2.5v5c0 1.4 1.1 2.5 2.5 2.5h2.4v-10Zm14.2 0h2.4c1.4 0 2.5 1.1 2.5 2.5v5c0 1.4-1.1 2.5-2.5 2.5h-2.4v-10Z" /></>;
      break;
    case "bars":
      content = <path d="M5.5 28V18h5v10h-5Zm8 0V11h5v17h-5Zm8 0V4h5v24h-5Z" />;
      break;
    case "arrow":
      content = <><path d="M4 8h13" /><path d="m13 4 4 4-4 4" /></>;
      break;
    case "hand-arrow":
      content = <><path d="M2 8c12-1 21-.5 31 1 8 1.2 13.7 4 18.6 8.2" /><path d="m45.7 11.7 6.2 5.6-8.3 1.6" /></>;
      break;
    default:
      content = null;
  }

  return (
    <svg
      viewBox={name === "arrow" ? "0 0 20 16" : name === "hand-arrow" ? "0 0 56 24" : "0 0 32 32"}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {content}
    </svg>
  );
}

export default function Pricing() {
  const [period, setPeriod] = useState("yearly");
  const formatPrice = (monthlyPrice) =>
    `₹${new Intl.NumberFormat("en-IN").format(period === "yearly" ? Math.round(monthlyPrice * 0.8) : monthlyPrice)}`;

  return (
    <section id="pricing" className={styles.section} data-section="pricing" aria-labelledby="pricing-title">
      <div className={styles.canvas}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>PLANS THAT GROW WITH YOU</p>
          <h2 id="pricing-title"><span>Simple pricing.</span><em>Serious results.</em></h2>
          <p className={styles.intro}>Choose the plan that fits your goals. Upgrade, pause or cancel anytime.</p>
        </header>

        <div className={styles.billingRow}>
          <span className={styles.savings}>Save up to 20%<Icon name="hand-arrow" className={styles.handArrow} /></span>
          <div className={styles.billingToggle} aria-label="Billing period">
            <button type="button" className={period === "monthly" ? styles.selectedPeriod : undefined} aria-pressed={period === "monthly"} onClick={() => setPeriod("monthly")}>Monthly</button>
            <button type="button" className={period === "yearly" ? styles.selectedPeriod : undefined} aria-pressed={period === "yearly"} onClick={() => setPeriod("yearly")}>Yearly</button>
          </div>
          <span className={styles.discount}>-20% OFF</span>
        </div>

        <aside className={styles.guarantee} aria-label="Money back guarantee">
          <Icon name="spark" className={styles.guaranteeSpark} />
          <strong>14-Day<br />{" "}Money Back<br />{" "}Guarantee</strong>
          <p>Try it. Love it.<br />{" "}Or get your money<br />{" "}back. No questions<br />{" "}asked.</p>
          <a className={styles.learnMore} href="#growth-cta">Learn more <Icon name="arrow" /></a>
        </aside>

        <div className={styles.cards}>
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={[styles.card, styles[plan.key], plan.popular ? styles.popularCard : ""].join(" ")}
              aria-labelledby={plan.key + "-plan-title"}
            >
              {plan.popular && <span className={styles.popularRibbon}>MOST POPULAR</span>}
              <div className={[styles.planIcon, plan.popular ? styles.darkIcon : ""].join(" ")}>
                <Icon name={plan.icon} />
              </div>
              <p className={styles.planLabel}>{plan.label}</p>
              <h3 id={plan.key + "-plan-title"}>{plan.title}</h3>
              <p className={styles.description}>{plan.description}</p>
              <div className={styles.price}><strong>{formatPrice(plan.monthlyPrice)}</strong><span>/month</span></div>
              <p className={styles.billingNote}>{period === "yearly" ? "Billed annually · 20% saved" : "Billed monthly"}</p>
              <ul className={styles.features}>
                {plan.features.map((feature) => <li key={feature}><Icon name="check" /><span>{feature}</span></li>)}
              </ul>
              <a href={plan.key === "enterprise" ? "mailto:sales@sharemarketalerts.com?subject=Enterprise%20plan" : "#growth-cta"} className={[styles.cta, plan.popular ? styles.primaryCta : ""].join(" ")}>
                <span>{plan.cta}</span><Icon name="arrow" />
              </a>
              {plan.popular && <p className={styles.noCard}><Icon name="shield" /><span>No credit card required</span></p>}
            </article>
          ))}
        </div>

        <ul className={styles.benefits} aria-label="Plan benefits">
          {benefits.map((benefit) => (
            <li key={benefit.title}>
              <Icon name={benefit.icon} className={styles.benefitIcon} />
              <strong>{benefit.title}</strong>
              <span>{benefit.copy}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
