import { useReducer, useEffect } from 'react';
import { reducer, initialState } from './reducer';
import { STORAGE_KEY, resultOptions, levelColors, confirmColors, avatarGradients, genderIcons } from './constants';
import { exportAllPDF } from './pdf';
import { Badge, Btn, formatSalary } from './components/ui';
import StatsPanel from './components/StatsPanel';
import CandidateForm from './components/CandidateForm';
import CandidateDetail from './components/CandidateDetail';
import type { Candidate } from './types';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { candidates, view, selectedCandidate, showForm, searchTerm, filterLevel, filterResult } = state;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Candidate[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_CANDIDATES', payload: parsed });
        }
      }
    } catch {
      // Invalid data – ignore
    }
  }, []);

  const filtered = candidates.filter((c) => {
    const s =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gmail.toLowerCase().includes(searchTerm.toLowerCase());
    const l = filterLevel === 'all' || c.level === filterLevel;
    const r = filterResult === 'all' || (c.interview?.result || '') === filterResult;
    return s && l && r;
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="max-w-[1020px] mx-auto">
        {/* ===== Header ===== */}
        <header className="flex justify-between items-start mb-8 flex-wrap gap-3 animate-fade-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-lg shadow-lg shadow-brand-500/30">
                👥
              </span>
              Recruitment System
            </h1>
            <p className="text-gray-400 text-sm mt-1 ml-[52px]">Manage candidates & interviews</p>
          </div>
          {candidates.length > 0 && (
            <Btn variant="pdf" onClick={() => exportAllPDF(candidates)}>
              📊 Export All PDF
            </Btn>
          )}
        </header>

        {view === 'list' ? (
          <>
            {/* Stats */}
            <StatsPanel candidates={candidates} />

            {/* ===== Toolbar ===== */}
            <div className="flex gap-3 mb-5 flex-wrap items-center animate-fade-up">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  🔍
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-sm bg-white text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-gray-300"
                  placeholder="Search name or email..."
                  value={searchTerm}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                />
              </div>

              {/* Filters */}
              <select
                className="px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-[13px] bg-white text-gray-700 outline-none cursor-pointer transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-gray-300"
                value={filterLevel}
                onChange={(e) => dispatch({ type: 'SET_FILTER_LEVEL', payload: e.target.value as any })}
              >
                <option value="all">All Levels</option>
                <option value="Senior">Senior</option>
                <option value="Beginner">Beginner</option>
                <option value="Newbie">Newbie</option>
              </select>

              <select
                className="px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-[13px] bg-white text-gray-700 outline-none cursor-pointer transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-gray-300"
                value={filterResult}
                onChange={(e) => dispatch({ type: 'SET_FILTER_RESULT', payload: e.target.value as any })}
              >
                <option value="all">All Results</option>
                {resultOptions
                  .filter((o) => o.value)
                  .map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
              </select>

              <Btn onClick={() => dispatch({ type: 'TOGGLE_FORM' })}>+ Add Candidate</Btn>
            </div>

            {/* New candidate form */}
            {showForm && (
              <div className="mb-5">
                <CandidateForm dispatch={dispatch} />
              </div>
            )}

            {/* ===== Candidate List ===== */}
            {filtered.length === 0 ? (
              <div className="animate-scale-in text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-100">
                <div className="text-6xl mb-4 opacity-50">📭</div>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                  {candidates.length === 0
                    ? 'No candidates yet. Add your first one!'
                    : 'No candidates match your filters.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 stagger-children">
                {filtered.map((c) => {
                  const sal = c.interview?.salaryExpectation
                    ? `$${formatSalary(c.interview.salaryExpectation)}${c.interview.salaryType === 'monthly' ? '/mo' : '/yr'}`
                    : null;
                  const cs = confirmColors[c.interviewStatus] || confirmColors['No Response'];

                  return (
                    <div
                      key={c.id}
                      className="animate-fade-up group bg-white rounded-xl px-5 py-4 cursor-pointer border-[1.5px] border-gray-100 flex justify-between items-center transition-all duration-200 shadow-soft hover:border-brand-300 hover:shadow-card hover:-translate-y-0.5"
                      onClick={() => dispatch({ type: 'SELECT', payload: c })}
                    >
                      {/* Left side */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md"
                          style={{ background: avatarGradients[c.gender] || avatarGradients.Male }}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[15px] text-gray-900 flex items-center gap-1.5">
                            {c.name}
                            {c.gender && (
                              <span className="text-xs opacity-50">{genderIcons[c.gender]}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 truncate">
                            {c.gmail} • {c.phone}
                            {sal && <span className="text-emerald-500 font-semibold"> • {sal}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-2 flex-wrap justify-end ml-3">
                        <Badge label={c.level} colors={levelColors[c.level]} />
                        <Badge
                          label={`${cs.icon} ${c.interviewStatus || 'No Response'}`}
                          colors={{ bg: cs.bg, text: cs.text, border: cs.border }}
                        />
                        {c.interview?.result && (
                          <Badge
                            label={c.interview.result}
                            colors={resultColors[c.interview.result] || { bg: '#f3f4f6', text: '#374151' }}
                          />
                        )}
                        <span className="text-gray-300 text-xl ml-1 group-hover:translate-x-1 group-hover:text-brand-400 transition-all duration-200">
                          ›
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          selectedCandidate && (
            <CandidateDetail
              candidate={candidates.find((c) => c.id === selectedCandidate.id) || selectedCandidate}
              dispatch={dispatch}
              state={state}
            />
          )
        )}
      </div>
    </div>
  );
}
