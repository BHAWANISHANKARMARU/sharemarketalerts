import Hero from "./components/Hero";
import IpoMarketIntelligence from "./components/IpoMarketIntelligence";
import HowItWorks from "./components/HowItWorks";
import WhatYouReceive from "./components/WhatYouReceive";
import MarketIntelligence from "./components/MarketIntelligence";
import MarketCoverage from "./components/MarketCoverage";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import GrowthCta from "./components/GrowthCta";
import MarketDataProvider from "./components/MarketDataProvider";
import { getHomeMarketData } from "../lib/market-data/home.js";

export default async function Home() {
  const marketData = await getHomeMarketData();

  return (
    <MarketDataProvider initialData={marketData}>
      <Hero />
      <IpoMarketIntelligence />
      <HowItWorks />
      <WhatYouReceive />
      <MarketIntelligence />
      <MarketCoverage />
      <Testimonials />
      <Pricing />
      <GrowthCta />
    </MarketDataProvider>
  );
}
