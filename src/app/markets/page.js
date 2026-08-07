import MarketDataProvider from "../components/MarketDataProvider";
import MarketsExperience from "../components/platform/MarketsExperience";
import { getHomeMarketData } from "../../lib/market-data/home";

export const revalidate = 60;

export const metadata = {
  title: "Markets — ShareMarketAlerts",
  description: "A composed view of indices, sectors, breadth and global market sessions.",
};

export default async function MarketsPage() {
  const marketData = await getHomeMarketData();
  return <MarketDataProvider initialData={marketData}><MarketsExperience /></MarketDataProvider>;
}
