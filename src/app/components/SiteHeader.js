"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LogoMark } from "./icons";
import { NAV_ITEMS } from "./siteNavigation";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header} data-site-header="true">
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="ShareMarketAlerts home">
          <LogoMark className={styles.logo} />
          <span>SHAREMARKETALERTS</span>
        </Link>

        <Link className={styles.search} href="/live-markets" aria-label="Search markets">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
          <span>Search markets</span>
          <kbd>⌘ K</kbd>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <a className={styles.login} href="mailto:support@sharemarketalerts.com?subject=Login%20access">
            Log in
          </a>
          <Link className={styles.cta} href="/stock-alerts">
            Start free <ArrowRight />
          </Link>
          <button
            className={styles.menuButton}
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="site-mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <nav id="site-mobile-navigation" className={styles.mobileNav} aria-label="Mobile navigation">
          {NAV_ITEMS.map((item, index) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
