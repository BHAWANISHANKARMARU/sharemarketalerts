export const emeraldMarketTheme = Object.freeze({
  colors: Object.freeze({
    primary: "#006b3c",
    accent: "#007a55",
    bright: "#00a76f",
    soft: "#e8f6ef",
    ink: "#101b17",
  }),
  chart: Object.freeze({
    stroke: "#007a55",
    gradientOpacity: 0.18,
  }),
  surfaces: Object.freeze({
    white: "#ffffff",
    soft: "linear-gradient(135deg, #ffffff 0%, #fbfdfc 38%, #f4f9f8 100%)",
  }),
  assets: Object.freeze({
    homeHero: "/hero-band-green.png",
    mobileMomentum: "/images/mobile-market-momentum-green.png",
    coverageGlobe: "/images/market-coverage-globe-green.png",
    intelligenceRadar: "/images/market-intelligence-radar-green.png",
    marketsHero: "/images/markets-indian-exchange-green.png",
    worldMap: "/images/world-market-map-green.png",
    marketNewsBse: "/images/market-news-bse-green.png",
    marketNewsChart: "/images/market-news-chart-green.png",
    marketNewsHandshake: "/images/market-news-handshake-green.png",
  }),
});

export const emeraldThemeStyle = Object.freeze({
  "--brand": emeraldMarketTheme.colors.primary,
  "--brand-2": emeraldMarketTheme.colors.accent,
  "--brand-3": emeraldMarketTheme.colors.bright,
  "--brand-soft": emeraldMarketTheme.colors.soft,
  "--ink": emeraldMarketTheme.colors.ink,
  "--ink-soft": "#2e443a",
  "--muted": "#607268",
  "--muted-2": "#84948b",
  "--line": "#e2ebe6",
  "--line-soft": "#edf3f0",
  "--band-deep": "#02130c",
  "--surface-white": emeraldMarketTheme.surfaces.white,
  "--surface-soft": emeraldMarketTheme.surfaces.soft,
  "--home-hero-artwork": `url("${emeraldMarketTheme.assets.homeHero}")`,
});
