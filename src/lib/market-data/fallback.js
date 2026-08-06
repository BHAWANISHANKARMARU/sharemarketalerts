const FALLBACK_UPDATED_AT = "2026-08-06T10:00:00.000Z";

function fallbackQuote(symbol, name, value, changePercent, currency = "INR") {
  return {
    symbol,
    displaySymbol: symbol.replace(/\.NS$|\.BO$/i, ""),
    name,
    value,
    formattedValue: new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value),
    changePercent,
    formattedChange: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
    direction: changePercent < 0 ? "down" : "up",
    currency,
    marketState: "CLOSED",
    updatedAt: FALLBACK_UPDATED_AT,
    href: `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}/`,
  };
}

export const FALLBACK_QUOTES = [
  fallbackQuote("^NSEI", "NIFTY 50", 24636, 0.05),
  fallbackQuote("^BSESN", "S&P BSE SENSEX", 80318.44, 0.11),
  fallbackQuote("^NSEBANK", "NIFTY BANK", 55290.65, 0.3),
  fallbackQuote("^INDIAVIX", "INDIA VIX", 12.48, -2.59),
  fallbackQuote("^IXIC", "NASDAQ Composite", 22977.75, 0.44, "USD"),
  fallbackQuote("^GSPC", "S&P 500", 6389.45, 0.21, "USD"),
  fallbackQuote("^DJI", "Dow Jones Industrial Average", 44663.12, -0.14, "USD"),
  fallbackQuote("INR=X", "USD/INR", 87.72, 0.12, "INR"),
  fallbackQuote("GC=F", "Gold Futures", 3384.2, 0.31, "USD"),
  fallbackQuote("RELIANCE.NS", "Reliance Industries Limited", 1325, 3.52),
  fallbackQuote("TCS.NS", "Tata Consultancy Services Limited", 3018.7, 1.86),
  fallbackQuote("HDFCBANK.NS", "HDFC Bank Limited", 978.35, 1.52),
  fallbackQuote("INFY.NS", "Infosys Limited", 1445.6, 1.21),
  fallbackQuote("ICICIBANK.NS", "ICICI Bank Limited", 1422.4, 1.05),
  fallbackQuote("TATAMOTORS.NS", "Tata Motors Passenger Vehicles", 322.15, 0.92),
  fallbackQuote("ADANIENT.NS", "Adani Enterprises Limited", 2188.2, -1.78),
  fallbackQuote("WIPRO.NS", "Wipro Limited", 251.45, -1.32),
  fallbackQuote("JSWSTEEL.NS", "JSW Steel Limited", 1074.9, -1.12),
  fallbackQuote("BPCL.NS", "Bharat Petroleum Corporation", 312.15, -0.98),
  fallbackQuote("TITAN.NS", "Titan Company Limited", 3462.2, -0.78),
];

export const FALLBACK_CHART = [
  24502, 24520, 24513, 24545, 24531, 24570, 24562, 24588, 24576, 24603,
  24591, 24622, 24610, 24638, 24619, 24647, 24631, 24658, 24644, 24636,
].map((value, index) => ({
  timestamp: new Date(Date.parse(FALLBACK_UPDATED_AT) - (19 - index) * 300000).toISOString(),
  value,
}));

export const FALLBACK_IPOS = [
  { id: "sample-ather", company: "Ather Energy Ltd", symbol: "ATHERENERG", status: "listed", issueSize: 2981.06, issueLow: 321, issueHigh: 321, gmp: 45, gmpPercent: 14.02, estimatedListingPrice: 366, expectedListingGain: 14.02, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://finance.yahoo.com/quote/ATHERENERG.NS/" },
  { id: "sample-lg", company: "LG Electronics India Ltd", symbol: "LGEINDIA", status: "listed", issueSize: 11607.01, issueLow: 1080, issueHigh: 1140, gmp: 120, gmpPercent: 10.53, estimatedListingPrice: 1260, expectedListingGain: 10.53, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://finance.yahoo.com/quote/LGEINDIA.NS/" },
  { id: "sample-hero", company: "Hero FinCorp Ltd", symbol: null, status: "historical", issueSize: 3668, issueLow: 334, issueHigh: 352, gmp: 38, gmpPercent: 10.8, estimatedListingPrice: 390, expectedListingGain: 10.8, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://ipoalerts.in/" },
  { id: "sample-bajaj", company: "Bajaj Housing Finance Ltd", symbol: "BAJAJHFL", status: "listed", issueSize: 6560, issueLow: 66, issueHigh: 70, gmp: 7, gmpPercent: 10, estimatedListingPrice: 77, expectedListingGain: 10, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://finance.yahoo.com/quote/BAJAJHFL.NS/" },
  { id: "sample-ntpc", company: "NTPC Green Energy Ltd", symbol: "NTPCGREEN", status: "listed", issueSize: 10000, issueLow: 102, issueHigh: 108, gmp: 12, gmpPercent: 11.11, estimatedListingPrice: 120, expectedListingGain: 11.11, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://finance.yahoo.com/quote/NTPCGREEN.NS/" },
  { id: "sample-ola", company: "OLA Electric Mobility Ltd", symbol: "OLAELEC", status: "listed", issueSize: 6145.56, issueLow: 72, issueHigh: 76, gmp: 6, gmpPercent: 7.89, estimatedListingPrice: 82, expectedListingGain: 7.89, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://finance.yahoo.com/quote/OLAELEC.NS/" },
  { id: "sample-swiggy", company: "Swiggy Ltd", symbol: "SWIGGY", status: "listed", issueSize: 11327.43, issueLow: 371, issueHigh: 390, gmp: 25, gmpPercent: 6.41, estimatedListingPrice: 415, expectedListingGain: 6.41, updatedAt: "2025-05-20T05:00:00.000Z", sourceMode: "fallback", href: "https://finance.yahoo.com/quote/SWIGGY.NS/" },
];

export const FALLBACK_TIMESTAMP = FALLBACK_UPDATED_AT;
