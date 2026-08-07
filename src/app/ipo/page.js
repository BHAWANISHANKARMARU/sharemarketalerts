import MarketDataProvider from "../components/MarketDataProvider";
import IpoExperience from "../components/platform/IpoExperience";
import { getHomeMarketData } from "../../lib/market-data/home";

export const revalidate = 60;

export const metadata = {
  title: "IPO Intelligence — ShareMarketAlerts",
  description: "Track IPO GMP, demand, dates, risk and listing milestones in one workflow.",
};

export default async function IpoPage() {
  const marketData = await getHomeMarketData();
  return <MarketDataProvider initialData={marketData}><IpoExperience /></MarketDataProvider>;
}
