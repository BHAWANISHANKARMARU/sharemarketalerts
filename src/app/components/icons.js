/* Inline SVG icons traced from the reference. All inherit `currentColor`
   unless the reference shows a fixed hue. */

export function LogoMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 42" fill="none" aria-hidden="true">
      <path d="M24 2 46 40H35.5L24 19.5 12.5 40H2L24 2Z" fill="#0f1836" />
      <path d="M24 19.5 35.5 40H12.5L24 19.5Z" fill="#0f1836" opacity=".18" />
      <path d="M24 24.5 32 38H16l8-13.5Z" fill="#8d9bc4" />
      <path d="M26 26.5 46 40H31.5L26 26.5Z" fill="#8d9bc4" opacity=".85" />
    </svg>
  );
}

export function ArrowRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.5 10h13m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 12 14" aria-hidden="true">
      <path d="M1 1.2 11 7 1 12.8V1.2Z" fill="currentColor" />
    </svg>
  );
}

/* ((•)) broadcast mark used by the signal cards and the LIVE pill */
export function SignalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="3.1" fill="currentColor" />
      <path
        d="M8.6 8.6a7.6 7.6 0 0 0 0 10.8M19.4 8.6a7.6 7.6 0 0 1 0 10.8"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M4.9 4.9a12.9 12.9 0 0 0 0 18.2M23.1 4.9a12.9 12.9 0 0 1 0 18.2"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13.6 2 4.5 13.4h6L10.4 22l9.1-11.4h-6L13.6 2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BoltSolid({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.6 2 4.5 13.4h6L10.4 22l9.1-11.4h-6L13.6 2Z" fill="currentColor" />
    </svg>
  );
}

/* concentric scanning target */
export function ScanIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      <circle cx="16" cy="16" r="6.2" stroke="currentColor" strokeWidth="1.7" />
      <circle
        cx="16"
        cy="16"
        r="10.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeDasharray="3.4 3.4"
      />
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.7" opacity=".55" />
      <path
        d="M16 16 6.5 25.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShieldCheck({ className }) {
  return (
    <svg className={className} viewBox="0 0 28 30" fill="none" aria-hidden="true">
      <path
        d="M14 2 3.5 6.2v8.3c0 6.4 4.4 11.6 10.5 13.5 6.1-1.9 10.5-7.1 10.5-13.5V6.2L14 2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="m9.4 14.6 3.3 3.4 6-6.3"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* stacked data discs */
export function StackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 30 28" fill="none" aria-hidden="true">
      <ellipse cx="15" cy="6.4" rx="10.6" ry="4.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.4 6.4v7.2c0 2.4 4.8 4.4 10.6 4.4s10.6-2 10.6-4.4V6.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.4 13.6v7.2c0 2.4 4.8 4.4 10.6 4.4s10.6-2 10.6-4.4v-7.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 30 28" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.4" r="5.1" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M2.8 24.4a9.2 9.2 0 0 1 18.4 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M20.4 4.2a5.1 5.1 0 0 1 0 8.4M23.4 17.2a9.2 9.2 0 0 1 4 7.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClipboardCheck({ className }) {
  return (
    <svg className={className} viewBox="0 0 28 30" fill="none" aria-hidden="true">
      <path
        d="M10.2 4.6h-4a2.6 2.6 0 0 0-2.6 2.6v17.4a2.6 2.6 0 0 0 2.6 2.6h15.6a2.6 2.6 0 0 0 2.6-2.6V7.2a2.6 2.6 0 0 0-2.6-2.6h-4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 4.6 14 1l3.8 3.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 16.8 3.4 3.4 6.6-6.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* dashed accuracy dial */
export function DialIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <circle
        cx="15"
        cy="15"
        r="12.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeDasharray="3.6 3.6"
      />
      <circle cx="15" cy="15" r="2.1" fill="currentColor" />
      <path
        d="M15 15 21.4 8.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M15 2.6v3.2M15 24.2v3.2M2.6 15h3.2M24.2 15h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Star({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 23" aria-hidden="true">
      <path
        d="m12 .8 3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6L12 18.2 5.2 21.8l1.3-7.6L1 8.8l7.6-1.1L12 .8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* small trend glyph that sits ahead of "MARKET MOMENTUM" on the band */
export function TrendGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <path
        d="M1 12.4 6 6.6l3.4 2.8L18.6 1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.6 1h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
