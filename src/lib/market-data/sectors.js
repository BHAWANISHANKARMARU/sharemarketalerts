export const SECTOR_DEFINITIONS = Object.freeze([
  Object.freeze({ symbol: "^CNXIT", label: "Technology Services" }),
  Object.freeze({ symbol: "NIFTY_CONSR_DURBL.NS", label: "Consumer Durables" }),
  Object.freeze({ symbol: "NIFTY_INDIA_MFG.NS", label: "Producer Manufacturing" }),
  Object.freeze({ symbol: "^CNXMETAL", label: "Non-Energy Minerals" }),
  Object.freeze({ symbol: "^CNXPHARMA", label: "Health Technology" }),
  Object.freeze({ symbol: "^CNXENERGY", label: "Energy Minerals" }),
  Object.freeze({ symbol: "NIFTY_FIN_SERVICE.NS", label: "Finance" }),
  Object.freeze({ symbol: "^CNXPSE", label: "Utilities" }),
  Object.freeze({ symbol: "^CNXSERVICE", label: "Consumer Services" }),
  Object.freeze({ symbol: "^CNXREALTY", label: "Realty" }),
  Object.freeze({ symbol: "NIFTY_MOBILITY.NS", label: "Transportation" }),
  Object.freeze({ symbol: "^CNXCONSUM", label: "Retailing" }),
  Object.freeze({ symbol: "^CNXFMCG", label: "FMCG" }),
]);

export const SECTOR_SYMBOLS = Object.freeze(
  SECTOR_DEFINITIONS.map(({ symbol }) => symbol),
);

const SECTOR_SYMBOL_SET = new Set(SECTOR_SYMBOLS);

export function isSectorSymbol(symbol) {
  return SECTOR_SYMBOL_SET.has(symbol);
}

export function buildSectorQuotes(quotes = []) {
  const quoteMap = new Map(
    quotes
      .filter((quote) => quote?.symbol && quote.changePercent !== null && quote.changePercent !== "" && Number.isFinite(Number(quote.changePercent)))
      .map((quote) => [quote.symbol, quote]),
  );

  return SECTOR_DEFINITIONS.flatMap(({ symbol, label }) => {
    const quote = quoteMap.get(symbol);
    if (!quote) return [];
    return [{ ...quote, symbol, label, changePercent: Number(quote.changePercent) }];
  });
}
