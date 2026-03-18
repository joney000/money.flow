import { useState, useMemo } from 'react';
import { generateMockData } from './utils/data';
import GlobalFlows from './components/GlobalFlows';
import CountryDetails from './components/CountryDetails';
import MarketInsights from './components/MarketInsights';
import { Activity, Globe, Search, BarChart3 } from 'lucide-react';
import { formatCurrency, cn } from './utils/helpers';

export default function App() {
  const [data] = useState(() => generateMockData());
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(d => d.country.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  const selectedData = useMemo(() => {
    return data.find(d => d.country === selectedCountry);
  }, [data, selectedCountry]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">FlowSight Analytics</h1>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Live Data (Simulated)
            </span>
            <span>WoW Ending Mar 18, 2026</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar - Country List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search countries..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h2 className="font-medium text-slate-200 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-slate-400" />
                  Top 50 Economies
                </h2>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {filteredCountries.map((country) => (
                  <button
                    key={country.country}
                    onClick={() => setSelectedCountry(country.country)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex justify-between items-center group",
                      selectedCountry === country.country 
                        ? "bg-indigo-600/20 text-indigo-300" 
                        : "hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    <span className="truncate pr-2">{country.country}</span>
                    <span className={cn(
                      "font-mono text-xs",
                      country.totalFlow >= 0 ? "text-emerald-400/80" : "text-rose-400/80"
                    )}>
                      {formatCurrency(country.totalFlow)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* AI Insights Panel */}
            <MarketInsights data={data} selectedCountry={selectedCountry || undefined} />

            {/* Data Visualization */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 min-h-[500px]">
              {selectedCountry && selectedData ? (
                <CountryDetails 
                  countryData={selectedData} 
                  onBack={() => setSelectedCountry(null)} 
                />
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                    <div>
                      <h2 className="text-3xl font-light text-slate-100 tracking-tight">Global Overview</h2>
                      <p className="text-slate-400 mt-1">Week-over-week net capital flows across top 50 economies</p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
                      <button className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded text-sm font-medium shadow-sm">
                        Net Flows
                      </button>
                      <button className="px-3 py-1.5 text-slate-400 hover:text-slate-200 rounded text-sm font-medium transition-colors">
                        Volume
                      </button>
                    </div>
                  </div>
                  <GlobalFlows data={data} onSelectCountry={setSelectedCountry} />
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
