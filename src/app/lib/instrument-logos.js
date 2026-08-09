const GOOGLE_FAVICONS = "https://www.google.com/s2/favicons";
const FMP_LOGOS = "https://financialmodelingprep.com/image-stock";

const INDEX_LOGO_SOURCES = Object.freeze({
  "^NSEI": `${GOOGLE_FAVICONS}?domain=niftyindices.com&sz=128`,
  "^NSEBANK": `${GOOGLE_FAVICONS}?domain=niftyindices.com&sz=128`,
  "^INDIAVIX": `${GOOGLE_FAVICONS}?domain=niftyindices.com&sz=128`,
  "^BSESN": "https://www.bseindia.com/assets/includenew/images/bselogo.png",
  "^IXIC": `${GOOGLE_FAVICONS}?domain=nasdaq.com&sz=128`,
  "^NDX": `${GOOGLE_FAVICONS}?domain=nasdaq.com&sz=128`,
  "^GSPC": `${GOOGLE_FAVICONS}?domain=spglobal.com&sz=128`,
  "^FTSE": `${GOOGLE_FAVICONS}?domain=lseg.com&sz=128`,
  "^GDAXI": `${GOOGLE_FAVICONS}?domain=dax-indices.com&sz=128`,
  "^N225": `${GOOGLE_FAVICONS}?domain=indexes.nikkei.co.jp&sz=128`,
  "^DJI": `${GOOGLE_FAVICONS}?domain=dowjones.com&sz=128`,
  "^HSI": "https://www.hsi.com.hk/static/uploads/assets/images/favicon.ico",
  "000001.SS": "https://www.sse.com.cn/favicon.ico",
  "^KS11": "https://global.krx.co.kr/favicon.ico",
  "^AXJO": `${GOOGLE_FAVICONS}?domain=asx.com.au&sz=128`,
  "^STI": `${GOOGLE_FAVICONS}?domain=sgx.com&sz=128`,
  "^FCHI": `${GOOGLE_FAVICONS}?domain=euronext.com&sz=128`,
  "^STOXX50E": `${GOOGLE_FAVICONS}?domain=stoxx.com&sz=128`,
  "^IBEX": "https://www.bolsasymercados.es/etc.clientlibs/bme/clientlibs/clientlib-site/resources/favicons/bme_favicon.ico",
  "FTSEMIB.MI": `${GOOGLE_FAVICONS}?domain=lseg.com&sz=128`,
  "^SSMI": `${GOOGLE_FAVICONS}?domain=six-group.com&sz=128`,
});

const INDIAN_STOCK_SYMBOL = /^[A-Z0-9][A-Z0-9&-]{0,24}\.(?:NS|BO)$/;
const UNQUALIFIED_TICKER = /^[A-Z0-9][A-Z0-9&-]{0,24}$/;

export function normalizeInstrumentSymbol(symbol) {
  return String(symbol || "")
    .trim()
    .toUpperCase()
    .replace(/\.NS$|\.BO$/g, "");
}

export function getInstrumentLogoSource(symbol) {
  const value = String(symbol || "").trim().toUpperCase();
  const indexSource = INDEX_LOGO_SOURCES[value];
  if (indexSource) return indexSource;

  const providerSymbol = INDIAN_STOCK_SYMBOL.test(value)
    ? value
    : UNQUALIFIED_TICKER.test(value)
      ? `${value}.NS`
      : null;

  return providerSymbol
    ? `${FMP_LOGOS}/${encodeURIComponent(providerSymbol)}.png`
    : null;
}

export function instrumentLogoUrl(symbol) {
  const value = String(symbol || "").trim().toUpperCase();
  const isIndex = Boolean(INDEX_LOGO_SOURCES[value]);
  if (!isIndex && !INDIAN_STOCK_SYMBOL.test(value)) return null;
  return `/api/market/logo?symbol=${encodeURIComponent(value)}`;
}
