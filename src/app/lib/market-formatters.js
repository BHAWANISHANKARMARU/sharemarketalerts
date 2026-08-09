function oneDecimal(value) {
  return Number(Number(value).toFixed(1)).toString();
}

export function formatIndianRevenue(value) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";

  const amount = Number(value);
  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  const crore = absolute / 10_000_000;

  if (crore >= 100_000) return `${sign}₹${oneDecimal(crore / 100_000)}LCr`;
  if (crore >= 1_000) return `${sign}₹${oneDecimal(crore / 1_000)}KCr`;
  if (crore >= 1) return `${sign}₹${oneDecimal(crore)}Cr`;
  return `${sign}₹${absolute.toFixed(2)}`;
}
