import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountryData } from '../utils/data';
import { formatCurrency } from '../utils/helpers';

interface GlobalFlowsProps {
  data: CountryData[];
  onSelectCountry: (country: string) => void;
}

export default function GlobalFlows({ data, onSelectCountry }: GlobalFlowsProps) {
  const topInflows = useMemo(() => data.slice(0, 10), [data]);
  const topOutflows = useMemo(() => [...data].sort((a, b) => a.totalFlow - b.totalFlow).slice(0, 10), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-200 font-medium mb-1">{payload[0].payload.country}</p>
          <p className={payload[0].value >= 0 ? "text-emerald-400" : "text-rose-400"}>
            Net Flow: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Inflows */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Largest Net Inflows (WoW)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topInflows} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(val) => `$${val}B`} stroke="#64748b" fontSize={12} />
                <YAxis dataKey="country" type="category" stroke="#64748b" fontSize={12} width={100} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                <Bar 
                  dataKey="totalFlow" 
                  radius={[0, 4, 4, 0]}
                  onClick={(data) => onSelectCountry(data.country)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {topInflows.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10b981" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Outflows */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-slate-200 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
            Largest Net Outflows (WoW)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topOutflows} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(val) => `$${Math.abs(val)}B`} stroke="#64748b" fontSize={12} reversed />
                <YAxis dataKey="country" type="category" stroke="#64748b" fontSize={12} width={100} orientation="right" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                <Bar 
                  dataKey="totalFlow" 
                  radius={[4, 0, 0, 4]}
                  onClick={(data) => onSelectCountry(data.country)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {topOutflows.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f43f5e" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
