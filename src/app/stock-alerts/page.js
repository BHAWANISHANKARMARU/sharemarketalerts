import MarketDataProvider from "../components/MarketDataProvider";
import StockAlertsExperience from "../components/platform/StockAlertsExperience";
import { getHomeMarketData } from "../../lib/market-data/home";

export const revalidate = 60;

export const metadata = {
  title: "Stock Alerts — ShareMarketAlerts",
  description: "Build precise stock alerts with quality thresholds and fast delivery.",
};

export default async function StockAlertsPage() {
  const marketData = await getHomeMarketData();
  return <MarketDataProvider initialData={marketData}><StockAlertsExperience /></MarketDataProvider>;
}
