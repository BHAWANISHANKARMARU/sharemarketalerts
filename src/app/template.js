import Footer from "./components/Footer";
import GrowthCta from "./components/GrowthCta";
import Pricing from "./components/Pricing";

export default function Template({ children }) {
  return (
    <>
      {children}
      <Pricing />
      <GrowthCta />
      <Footer />
    </>
  );
}
