import React from 'react';
import type { Candidate, Level } from '../types';
import { levelColors, resultColors } from '../constants';

interface Props {
  candidates: Candidate[];
}

const levels: Level[] = ['Senior', 'Beginner', 'Newbie'];
const resultKeys = ['Potential Talented', 'Hired', 'Rejected', 'Future Consideration'];

const StatsPanel: React.FC<Props> = ({ candidates }) => {
  const totalAssessed = candidates.filter((c) => c.interview?.result).length;

  const lCounts = levels.map((l) => ({
    label: l,
    count: candidates.filter((c) => c.level === l).length,
    colors: levelColors[l],
  }));

  const rCounts = resultKeys
    .map((r) => ({
      label: r,
      count: candidates.filter((c) => c.interview?.result === r).length,
      colors: resultColors[r] || { bg: '#f3f4f6', text: '#374151' },
    }))
    .sort((a, b) => b.count - a.count);

  const summaryCards = [
    { label: 'Total', value: candidates.length, color: '#6366f1', gradient: 'from-brand-500/10 to-brand-600/5', icon: '👥' },
    { label: 'Confirmed', value: candidates.filter((c) => c.interviewStatus === 'Confirmed').length, color: '#10b981', gradient: 'from-emerald-500/10 to-emerald-600/5', icon: '✅' },
    { label: 'Assessed', value: totalAssessed, color: '#f59e0b', gradient: 'from-amber-500/10 to-amber-600/5', icon: '📋' },
    { label: 'Hired', value: candidates.filter((c) => c.interview?.result === 'Hired').length, color: '#3b82f6', gradient: 'from-blue-500/10 to-blue-600/5', icon: '🎉' },
  ];

  return (
    <div className="animate-fade-up space-y-5 mb-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {summaryCards.map((s) => (
          <div
            key={s.label}
            className={`animate-fade-up bg-white rounded-2xl p-5 text-center shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-gray-100 bg-gradient-to-br ${s.gradient} relative overflow-hidden group`}
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: s.color }} />
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
            <div className="text-3xl font-extrabold tracking-tight" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Level breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
          <span>📊</span> By Level
        </div>
        <div className="flex gap-3">
          {lCounts.map((l) => (
            <div
              key={l.label}
              className="flex-1 text-center rounded-xl py-5 px-3 transition-all duration-300 hover:scale-[1.03] cursor-default"
              style={{
                background: l.colors.bg,
                border: `1.5px solid ${l.colors.border}`,
              }}
            >
              <div className="text-3xl font-extrabold tracking-tight" style={{ color: l.colors.text }}>
                {l.count}
              </div>
              <div className="text-sm font-semibold mt-1" style={{ color: l.colors.text }}>
                {l.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
          <span>🏆</span> By Result
          {totalAssessed > 0 && (
            <span className="font-normal text-gray-400 text-xs ml-1">
              ({totalAssessed} assessed)
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rCounts.map((r) => (
            <div
              key={r.label}
              className="text-center rounded-xl py-4 px-3 transition-all duration-300 hover:scale-[1.03] cursor-default"
              style={{
                background: r.colors.bg,
                opacity: r.count === 0 ? 0.4 : 1,
              }}
            >
              <div className="text-2xl font-extrabold" style={{ color: r.colors.text }}>
                {r.count}
              </div>
              <div className="text-xs font-semibold mt-1" style={{ color: r.colors.text }}>
                {r.label}
              </div>
              {totalAssessed > 0 && r.count > 0 && (
                <div className="text-[10px] mt-1 opacity-60" style={{ color: r.colors.text }}>
                  {Math.round((r.count / totalAssessed) * 100)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
