import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: any[];
  dataKey: string;
  color?: string;
  symbol?: string;
}

export const ForecastChart: React.FC<Props> = ({ data, dataKey, color = "#00D4FF", symbol = "$" }) => {
  return (
    <div className="w-full h-[300px] bg-slate-900/50 rounded-xl p-4 border border-white/5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} tickMargin={10} />
          <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(v) => `${symbol}${v.toFixed(0)}`} width={60} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
