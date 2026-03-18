import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { CountryData } from '../utils/data';
import { Sparkles, Loader2 } from 'lucide-react';

interface MarketInsightsProps {
  data: CountryData[];
  selectedCountry?: string;
}

export default function MarketInsights({ data, selectedCountry }: MarketInsightsProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        let prompt = '';
        if (selectedCountry) {
          const countryData = data.find(d => d.country === selectedCountry);
          prompt = `Analyze this week-over-week capital flow data for ${selectedCountry}. Total net flow: ${countryData?.totalFlow} Billion USD. Breakdown: ${JSON.stringify(countryData?.assetFlows)}. Provide a concise, professional 2-paragraph financial analyst summary explaining potential macroeconomic reasons for these specific asset class movements.`;
        } else {
          const topInflows = data.slice(0, 3).map(d => `${d.country} (+${d.totalFlow}B)`);
          const topOutflows = [...data].sort((a, b) => a.totalFlow - b.totalFlow).slice(0, 3).map(d => `${d.country} (${d.totalFlow}B)`);
          prompt = `Analyze this global week-over-week capital flow data. Top inflows: ${topInflows.join(', ')}. Top outflows: ${topOutflows.join(', ')}. Provide a concise, professional 2-paragraph global macroeconomic summary explaining what might be driving capital from the outflow countries to the inflow countries.`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        setInsight(response.text || 'No insights generated.');
      } catch (error) {
        console.error('Failed to fetch insights:', error);
        setInsight('Failed to generate insights. Please check your API key.');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [data, selectedCountry]);

  return (
    <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
      <h3 className="text-lg font-medium text-indigo-200 mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
        AI Market Insights {selectedCountry ? `- ${selectedCountry}` : '- Global'}
      </h3>
      
      {loading ? (
        <div className="flex items-center text-indigo-300/70 py-4">
          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
          Analyzing capital flows...
        </div>
      ) : (
        <div className="prose prose-invert prose-indigo max-w-none">
          {insight?.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-slate-300 leading-relaxed text-sm">{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}
