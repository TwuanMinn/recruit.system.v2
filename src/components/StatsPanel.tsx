import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import type { Candidate, Level } from '../types';
import { Icon } from './ui';
import { CountUp } from './CountUp';
import { useDarkMode } from '../hooks/useDarkMode';

interface Props {
  candidates: Candidate[];
}

const levels: Level[] = ['Senior', 'Beginner', 'Newbie'];
const resultKeys = ['Hired', 'Potential Talented', 'Rejected', 'Future Consideration'];

const levelBarColors: Record<Level, string> = {
  Senior: 'bg-primary',
  Beginner: 'bg-on-surface-variant',
  Newbie: 'bg-tertiary',
};

const LEVEL_DONUT_COLORS: Record<Level, string> = {
  Senior: '#6366f1',
  Beginner: '#10b981',
  Newbie: '#f59e0b',
};

const resultConfig: Record<string, { color: string; icon: string }> = {
  Hired: { color: 'text-secondary', icon: 'check_circle' },
  'Potential Talented': { color: 'text-primary', icon: 'star' },
  Rejected: { color: 'text-error', icon: 'cancel' },
  'Future Consideration': { color: 'text-tertiary', icon: 'schedule' },
};

const RESULT_BAR_COLORS: Record<string, string> = {
  Hired: '#10b981',
  Rejected: '#ef4444',
  'Potential Talented': '#6366f1',
  'Future Consideration': '#f59e0b',
};

const resultLabels: Record<string, string> = {
  Hired: 'Hired',
  'Potential Talented': 'Potential',
  Rejected: 'Rejected',
  'Future Consideration': 'Future',
};

const summaryConfig = [
  { key: 'total', label: 'Total Candidates', icon: 'groups', gradient: 'from-primary/10 to-primary/5', iconBg: 'bg-primary/10', iconColor: 'text-primary', valueColor: 'text-on-surface' },
  { key: 'confirmed', label: 'Confirmed', icon: 'check_circle', gradient: 'from-secondary/10 to-secondary/5', iconBg: 'bg-secondary/10', iconColor: 'text-secondary', valueColor: 'text-secondary' },
  { key: 'denied', label: 'Denied', icon: 'cancel', gradient: 'from-error/10 to-error/5', iconBg: 'bg-error/10', iconColor: 'text-error', valueColor: 'text-error' },
  { key: 'pending', label: 'No Response', icon: 'schedule', gradient: 'from-surface-variant/30 to-surface-variant/10', iconBg: 'bg-surface-container', iconColor: 'text-outline', valueColor: 'text-on-surface-variant' },
] as const;

const StatsPanel: React.FC<Props> = ({ candidates }) => {
  const total = candidates.length;
  const values: Record<string, number> = {
    total,
    confirmed: candidates.filter((c) => c.interviewStatus === 'Confirmed').length,
    denied: candidates.filter((c) => c.interviewStatus === 'Rejected').length,
    pending: candidates.filter((c) => c.interviewStatus === 'No Response').length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {summaryConfig.map((s, i) => (
        <div
          key={s.key}
          className={`relative overflow-hidden bg-surface-container-lowest p-5 sm:p-6 rounded-2xl card-shadow card-hover border border-outline-variant/10 cursor-default animate-slide-up`}
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-60 pointer-events-none`} />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-13 h-13 ${s.iconBg} ${s.iconColor} rounded-xl flex items-center justify-center p-2.5`}>
                <Icon name={s.icon} size="text-3xl" />
              </div>
              {s.key !== 'total' && total > 0 && (
                <span className={`text-base font-extrabold tabular-nums ${s.valueColor}`}>
                  {Math.round((values[s.key] / total) * 100)}%
                </span>
              )}
            </div>
            <span className="text-[0.6875rem] font-semibold tracking-wide uppercase text-on-surface/45 block mb-1">
              {s.label}
            </span>
            <div className={`text-3xl sm:text-4xl font-extrabold ${s.valueColor} tracking-tight tabular-nums`}>
              <CountUp to={values[s.key]} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===== Talent Distribution (Right Rail) =====
export const TalentDistribution: React.FC<Props> = ({ candidates }) => {
  const [darkMode] = useDarkMode();
  const total = candidates.length;
  const lCounts = levels.map((l) => {
    const count = candidates.filter((c) => c.level === l).length;
    return {
      label: l,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
      color: LEVEL_DONUT_COLORS[l],
    };
  });
  const donutData = lCounts.filter((d) => d.count > 0);

  return (
    <div className="bg-surface-container-lowest flex flex-col p-5 sm:p-8 rounded-2xl card-shadow border border-outline-variant/10">
      <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-on-surface/50 mb-4">Talent Distribution</h3>

      {/* Donut chart */}
      {total > 0 && (
        <div className="relative h-44 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={4}
                dataKey="count"
                strokeWidth={0}
                animationBegin={200}
                animationDuration={800}
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: darkMode ? 'rgb(22,28,42)' : '#fff',
                  border: darkMode ? '1px solid rgba(45,60,85,0.5)' : '1px solid rgba(148,180,224,0.12)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: darkMode ? 'rgb(200,214,233)' : '#1f2937',
                  padding: '8px 14px',
                }}
                formatter={(value: unknown, name: unknown) => [`${value}`, `${name}`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-on-surface tabular-nums">{total}</div>
              <div className="text-[0.575rem] font-bold text-on-surface/35 uppercase tracking-widest">Total</div>
            </div>
          </div>
        </div>
      )}

      {/* Legend dots */}
      {total > 0 && (
        <div className="flex justify-center gap-4 mb-5">
          {donutData.map((d) => (
            <div key={d.label} className="flex items-center gap-1.5 text-xs font-bold text-on-surface/55">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
              {d.label}
            </div>
          ))}
        </div>
      )}

      {/* Progress bars */}
      <div className="space-y-4">
        {lCounts.map((l) => (
          <div key={l.label}>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-on-surface">{l.label}</span>
              <span className="text-on-surface tabular-nums">
                {l.count} <span className="opacity-50 font-medium text-xs ml-1">({l.pct}%)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full ${levelBarColors[l.label as Level]} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${l.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== Application Health (Right Rail) =====
export const ApplicationHealth: React.FC<Props> = ({ candidates }) => {
  const [darkMode] = useDarkMode();
  const totalAssessed = candidates.filter((c) => c.interview?.result).length;
  const rCounts = resultKeys.map((r) => ({
    label: resultLabels[r],
    count: candidates.filter((c) => c.interview?.result === r).length,
    color: resultConfig[r]?.color || 'text-on-surface',
    icon: resultConfig[r]?.icon || 'info',
  }));

  const barData = resultKeys.map((r) => {
    const count = candidates.filter((c) => c.interview?.result === r).length;
    const pct = totalAssessed > 0 ? Math.round((count / totalAssessed) * 100) : 0;
    return {
      label: resultLabels[r],
      count,
      pct,
      pctLabel: pct > 0 ? `${pct}%` : '',
      color: RESULT_BAR_COLORS[r],
    };
  });

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
    <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-2xl card-shadow border border-outline-variant/10 h-max">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-on-surface/50">Application Results</h3>
        {totalAssessed > 0 && (
          <span className="text-xs font-bold text-on-surface/35 tabular-nums flex items-center gap-1">
            <Icon name="trending_up" size="text-sm" className="text-secondary" /> {totalAssessed} assessed
          </span>
        )}
      </div>

      {/* Bar chart */}
      <div className="mb-6">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barCategoryGap="28%" margin={{ top: 14, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? 'rgba(200,214,233,0.45)' : 'rgba(15,23,42,0.4)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? 'rgba(200,214,233,0.35)' : 'rgba(15,23,42,0.3)' }}
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
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44} animationDuration={800}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
                <LabelList
                  dataKey="pctLabel"
                  position="top"
                  style={{ fontSize: 10, fontWeight: 700, fill: darkMode ? 'rgba(200,214,233,0.6)' : 'rgba(15,23,42,0.5)' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rCounts.map((r) => (
          <div key={r.label} className="bg-surface p-4 rounded-xl text-center transition-colors hover:bg-surface-container-low cursor-default">
            <Icon name={r.icon} className={`${r.color} mb-2`} size="text-3xl" />
            <div className={`text-2xl font-extrabold ${r.color} tabular-nums`}>
              <CountUp to={r.count} />
            </div>
            <div className="text-[0.6rem] font-bold text-on-surface/35 uppercase tracking-wider mt-1">
              {r.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StatsPanel;
