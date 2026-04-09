import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import type { Candidate, ResultValue } from '../types';
import { useDarkMode } from '../hooks/useDarkMode';

interface Props {
  candidates: Candidate[];
}

const RESULTS: { key: ResultValue; label: string; color: string }[] = [
  { key: 'Hired',                label: 'Hired',   color: '#10b981' },
  { key: 'Rejected',             label: 'Rejected', color: '#ef4444' },
  { key: 'Potential Talented',   label: 'Potential', color: '#6366f1' },
  { key: 'Future Consideration', label: 'Future',  color: '#f59e0b' },
];

const ChartPanel: React.FC<Props> = ({ candidates }) => {
  const [darkMode] = useDarkMode();

  const totalAssessed = candidates.filter((c) => c.interview?.result).length;

  const data = RESULTS.map(({ key, label, color }) => {
    const count = candidates.filter((c) => c.interview?.result === key).length;
    const pct = totalAssessed > 0 ? Math.round((count / totalAssessed) * 100) : 0;
    return { label, count, pct, pctLabel: pct > 0 ? `${pct}%` : '', color };
  });

  if (candidates.length === 0) return null;

  const tooltipStyle = {
    background: darkMode ? 'rgb(22,28,42)' : '#fff',
    border: darkMode ? '1px solid rgba(45,60,85,0.5)' : '1px solid rgba(148,180,224,0.12)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: darkMode ? 'rgb(200,214,233)' : '#1f2937',
    padding: '8px 14px',
  };

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-2xl card-shadow border border-outline-variant/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-on-surface/50">Pipeline Overview</h3>
        {totalAssessed > 0 && (
          <span className="text-xs font-bold text-on-surface/35 tabular-nums">
            {totalAssessed} assessed
          </span>
        )}
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="28%" margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? '#ffffff' : '#000000' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? '#ffffff' : '#000000' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', radius: 6 }}
              formatter={(value: unknown, _name: unknown, props: { payload?: { pct: number } }) => [
                `${value} candidate${Number(value) !== 1 ? 's' : ''} (${props.payload?.pct ?? 0}%)`,
                '',
              ]}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48} animationDuration={800}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
              <LabelList
                dataKey="pctLabel"
                position="top"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: darkMode ? '#ffffff' : '#000000',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4">
        {RESULTS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-[0.65rem] font-bold text-on-surface/50">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartPanel;
