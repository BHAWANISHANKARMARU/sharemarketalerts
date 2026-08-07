import MarketDataProvider from "../components/MarketDataProvider";
import LiveMarketsExperience from "../components/platform/LiveMarketsExperience";
import { getHomeMarketData } from "../../lib/market-data/home";

export const revalidate = 60;

export const metadata = {
  title: "Live Markets — ShareMarketAlerts",
  description: "A real-time command view of momentum, movers, breadth and market risk.",
};

export default async function LiveMarketsPage() {
  const marketData = await getHomeMarketData();
  return <MarketDataProvider initialData={marketData}><LiveMarketsExperience /></MarketDataProvider>;
}
