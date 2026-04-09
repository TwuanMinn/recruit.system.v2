import React from 'react';
import type { Candidate, Level } from '../types';
import { Icon } from './ui';

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
const levelTextColors: Record<Level, string> = {
  Senior: 'text-gray-900',
  Beginner: 'text-gray-900',
  Newbie: 'text-gray-900',
};

const resultConfig: Record<string, { color: string }> = {
  Hired: { color: 'text-secondary' },
  'Potential Talented': { color: 'text-primary' },
  Rejected: { color: 'text-error' },
  'Future Consideration': { color: 'text-tertiary' },
};

const resultLabels: Record<string, string> = {
  Hired: 'Hired',
  'Potential Talented': 'Potential',
  Rejected: 'Rejected',
  'Future Consideration': 'Future',
};

const StatsPanel: React.FC<Props> = ({ candidates }) => {
  const total = candidates.length;

  const summaryCards = [
    { label: 'Total Candidates', value: total, icon: 'groups', containerBg: 'bg-primary-container/30', iconColor: 'text-primary' },
    { label: 'Confirmed', value: candidates.filter((c) => c.interviewStatus === 'Confirmed').length, icon: 'check_circle', containerBg: 'bg-secondary-container/30', iconColor: 'text-secondary' },
    { label: 'Rejected', value: candidates.filter((c) => c.interviewStatus === 'Rejected').length, icon: 'cancel', containerBg: 'bg-error-container/30', iconColor: 'text-error' },
    { label: 'No Response', value: candidates.filter((c) => c.interviewStatus === 'No Response').length, icon: 'schedule', containerBg: 'bg-surface-variant/50', iconColor: 'text-outline' },
  ];

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {summaryCards.map((s) => (
          <div key={s.label} className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl card-shadow border border-outline-variant/10">
            <div className={`w-12 h-12 ${s.containerBg} ${s.iconColor} rounded-xl flex items-center justify-center mb-4`}>
              <Icon name={s.icon} />
            </div>
            <span className="text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/50">
              {s.label}
            </span>
            <div className="text-4xl font-black text-on-surface mt-2 tracking-tight">
              {s.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Right-rail breakdown rendered separately in App layout */}
      {/* Store data here for the rail component */}
    </>
  );
};

// ===== Talent Distribution (Right Rail) =====
export const TalentDistribution: React.FC<Props> = ({ candidates }) => {
  const total = candidates.length;
  const lCounts = levels.map((l) => {
    const count = candidates.filter((c) => c.level === l).length;
    return {
      label: l,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  return (
    <div className="bg-surface-container-lowest flex flex-col p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10">
      <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-on-surface/50 mb-6">Talent Distribution</h3>
      <div className="space-y-6">
        {lCounts.map((l) => (
          <div key={l.label}>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-on-surface">{l.label}</span>
              <span className={levelTextColors[l.label as Level]}>
                {l.count} <span className="opacity-60 font-medium text-xs ml-1">({l.pct}%)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full ${levelBarColors[l.label as Level]} transition-all duration-700`}
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
  const totalAssessed = candidates.filter((c) => c.interview?.result).length;
  const rCounts = resultKeys.map((r) => ({
    label: resultLabels[r],
    count: candidates.filter((c) => c.interview?.result === r).length,
    color: resultConfig[r]?.color || 'text-on-surface',
  }));

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10 h-max">
      <h3 className="text-sm font-bold tracking-[0.05em] uppercase text-on-surface/50 mb-6">Application Results</h3>
      <div className="grid grid-cols-2 gap-4">
        {rCounts.map((r) => (
          <div key={r.label} className="bg-surface-container-lowest p-4 rounded-xl text-center">
            <div className={`text-2xl font-black ${r.color}`}>{r.count}</div>
            <div className="text-[0.625rem] font-bold text-on-surface/40 uppercase tracking-wider mt-1">
              {r.label}
            </div>
          </div>
        ))}
      </div>
      {totalAssessed > 0 && (
        <div className="mt-8 pt-6 border-t border-outline-variant/10">
          <div className="flex items-center justify-between text-xs font-bold text-on-surface/60">
            <span>Total Assessed</span>
            <span className="text-secondary flex items-center gap-0.5">
              <Icon name="trending_up" className="text-sm" /> {totalAssessed}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
