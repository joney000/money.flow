export const COUNTRIES = [
  "United States", "China", "Japan", "Germany", "India",
  "United Kingdom", "France", "Italy", "Brazil", "Canada",
  "Russia", "South Korea", "Australia", "Mexico", "Spain",
  "Indonesia", "Saudi Arabia", "Netherlands", "Turkey", "Switzerland",
  "Poland", "Argentina", "Sweden", "Belgium", "Thailand",
  "Israel", "Ireland", "Norway", "Nigeria", "United Arab Emirates",
  "Egypt", "Austria", "Bangladesh", "Malaysia", "Singapore",
  "Vietnam", "South Africa", "Philippines", "Denmark", "Iran",
  "Pakistan", "Hong Kong", "Colombia", "Romania", "Chile",
  "Czech Republic", "Finland", "Iraq", "Portugal", "New Zealand"
];

export const ASSET_CLASSES = [
  "Equities",
  "Fixed Income",
  "Real Estate",
  "Commodities",
  "Crypto",
  "Cash/FX"
];

export interface AssetFlow {
  assetClass: string;
  flow: number; // in billions USD
}

export interface CountryData {
  country: string;
  totalFlow: number;
  assetFlows: AssetFlow[];
}

// Simple deterministic random number generator for consistent mock data
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function generateMockData(): CountryData[] {
  const rand = mulberry32(12345); // Seeded for consistency
  
  return COUNTRIES.map((country, index) => {
    // Scale flows based roughly on economy size (index 0 is largest)
    const scale = Math.max(1, 50 - index) * 2;
    
    let totalFlow = 0;
    const assetFlows = ASSET_CLASSES.map(assetClass => {
      // Random flow between -scale and +scale
      const flow = (rand() * 2 * scale) - scale;
      totalFlow += flow;
      return {
        assetClass,
        flow: Number(flow.toFixed(2))
      };
    });

    return {
      country,
      totalFlow: Number(totalFlow.toFixed(2)),
      assetFlows: assetFlows.sort((a, b) => b.flow - a.flow)
    };
  }).sort((a, b) => b.totalFlow - a.totalFlow);
}
