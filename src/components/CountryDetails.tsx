import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { CountryData } from '../utils/data';
import { formatCurrency } from '../utils/helpers';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';

interface CountryDetailsProps {
  countryData: CountryData;
  onBack: () => void;
}

export default function CountryDetails({ countryData, onBack }: CountryDetailsProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-200 font-medium mb-1">{payload[0].payload.assetClass}</p>
          <p className={payload[0].value >= 0 ? "text-emerald-400" : "text-rose-400"}>
            Flow: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Global Overview
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-3xl font-light text-slate-100 tracking-tight">{countryData.country}</h2>
          <p className="text-slate-400 mt-1">Asset Class Flow Breakdown (Week over Week)</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 min-w-[200px]">
          <p className="text-sm text-slate-400 mb-1">Total Net Flow</p>
          <div className="flex items-center">
            {countryData.totalFlow >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 text-rose-500 mr-2" />
            )}
            <span className={`text-2xl font-mono ${countryData.totalFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(countryData.totalFlow)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-6">Net Flow by Asset Class</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData.assetFlows} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="assetClass" stroke="#64748b" fontSize={12} />
              <YAxis tickFormatter={(val) => `$${val}B`} stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="flow" radius={[4, 4, 0, 0]}>
                {countryData.assetFlows.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.flow >= 0 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {countryData.assetFlows.map((asset) => (
          <div key={asset.assetClass} className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-slate-300">{asset.assetClass}</span>
            <span className={`font-mono ${asset.flow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(asset.flow)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
