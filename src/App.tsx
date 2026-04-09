import { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reducer, initialState } from './reducer';
import { STORAGE_KEY } from './constants';
import { StatusDot, Icon } from './components/ui';
import StatsPanel, { TalentDistribution, ApplicationHealth } from './components/StatsPanel';
import CandidateForm from './components/CandidateForm';
import CandidateDetail from './components/CandidateDetail';
import type { Candidate, Level } from './types';

// Random avatars for demo
const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD866fSCX0bf48LCtjJwY8B4qz5dDoc6ZKD3Zbj2Uu-ExzO_l0SV-61iOepKPHGZg_jqENnpnZJR4HnEKlC6oWw5AcukGzSpOaz-8_A34XqIF49jZyiSaXJ6pFPMTTde2pRJXwyVEWEUF-w9ZcjF-DmCEQAwgwVSi-qgyteJozc097wA38a7ew1KWShitG35UCAYbnCjMdtNqPwOvIYN2fdLkdHLYyGHhcvraqDCQ4nDlALwRTLZ8fY7sJGKsCBlPk83EmSqDKWzjkh',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDg0z-sdZUvkWAR15tJIK8pRiGDF7Ng-YM8mWyBuZ3x4N_xAKllf9meW9B1bIKoYWH-0-NMeVr8U7bq8L9m1QrSqphoN_gACsLR2RT8kPhB_BfkblJD2H_5gTrdTuyvKnd7dp8M2xvjMl9ugoxL_AYmxJQpzkMJieZwmzOWWvTLMdLCP0CPzFJPHdSAMfVNvNAqNL6Xh5px8KvqMzjI2EF6H9qQ_Z_Ndd8JzWmxanmNluxAYS6ajY0E_u6UMauYR9iVNs7tdNzF7d6s',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCe50Y5lqjPlw8vJWHkJWFrB4aDKRKSNSYWTZch1Y8nfYcas6MTbQyjC5OjdkqNfcEZDP7mivxh-pDlWZYaNk1W90rPBCkW8AWO24sXcg3yFzM5JUKJZ2atOSik-VM8tJTjYJ7l1OcQpEIEl7zpFmlgKQIhiil2JtbFSS6FpAu_4iSO0f_yodVcIt5ISJg-Zycff8ig6KYplSETMDDygNRP5Hps8mTeQpLMipXMRNfrI7SZAWOj17RR5wqwkzj6y5X9fJAvIQUTuowt',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuATTwxSEU-s2jtZkYPF6HFrutmYp3HdpJNTVfiT3Prrh3shciJCjhR_wGzRNuvwj8HKN94XX6OXspBom2ClDh493b4dfvuJ6Ip1UBfVE6D0WGSaTW2zUt9vzlCZB1VedEAuq-m1tEVnWqPh4lL77nDVUrpovKrSp2FhF4UGW9U0OcurAKL4oQ4MLJch0BTZy-TwpoxLirOheevppLqcnOFwD5IU5bPoSTkcZJWM5Rpd4Qo7DLhCvwO65sw8rMGe2sxtXHiL4gvpk2XO',
];

const levelBadgeConfig: Record<Level, { color: string; border: string }> = {
  Senior: { color: 'text-primary', border: 'border-primary/10' },
  Beginner: { color: 'text-on-surface-variant', border: 'border-outline-variant/30' },
  Newbie: { color: 'text-tertiary', border: 'border-tertiary/10' },
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { candidates, view, selectedCandidate, showForm, searchTerm, filterLevel, filterResult } = state;
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
      // Invalid data
    }
  }, []);

  const filtered = candidates.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.gmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = filterLevel === 'all' || c.level === filterLevel;
    const matchResult = filterResult === 'all' || 
      (filterResult === 'Confirmed' ? c.interviewStatus === 'Confirmed' : 
       filterResult === 'No Response' ? c.interviewStatus === 'No Response' :
       c.interview?.result === filterResult);
    return matchSearch && matchLevel && matchResult;
  });

  return (
    <div className="flex bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container">
{/* ===== SideNavBar Removed ===== */}

      {/* ===== Main Content ===== */}
      <main className="min-h-screen w-full max-w-7xl mx-auto">


        <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <AnimatePresence mode="wait">
          {view === 'list' && !showForm && (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Header Title Section */}
              <div className="py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">Candidates Overview</h1>
                  <p className="text-sm sm:text-base text-on-surface/60 mt-1">Reviewing the latest talent acquisition metrics and profiles.</p>
                </div>
                <div className="flex flex-row w-full sm:w-auto gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <button 
                      className={`w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 font-bold text-sm rounded-xl active:scale-95 transition-all flex items-center gap-2 ${filterOpen || filterLevel !== 'all' || filterResult !== 'all' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-highest/80'}`}
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <Icon name="filter_list" size="text-lg" /> Filter
                      {(filterLevel !== 'all' || filterResult !== 'all') && <span className="bg-white text-primary text-[0.625rem] w-4 h-4 flex items-center justify-center rounded-full ml-1">!</span>}
                    </button>

                    {filterOpen && (
                      <div className="absolute left-0 sm:left-auto right-0 mt-2 w-full sm:w-56 bg-surface-container-lowest border border-outline-variant/10 shadow-xl rounded-2xl p-5 z-50 animate-fade-in card-shadow text-left">
                        <div className="mb-4">
                          <label className="block text-[0.625rem] font-bold tracking-[0.05em] text-on-surface/50 uppercase mb-2">Seniority Level</label>
                          <select 
                            className="w-full px-3 py-2 bg-surface text-sm font-bold text-on-surface rounded-xl border border-outline-variant/20 outline-none cursor-pointer focus:ring-2 focus:border-primary/50 focus:ring-primary/20"
                            value={filterLevel}
                            onChange={(e) => dispatch({ type: 'SET_FILTER_LEVEL', payload: e.target.value })}
                          >
                            <option value="all">All Levels</option>
                            <option value="Senior">Senior</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Newbie">Newbie</option>
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="block text-[0.625rem] font-bold tracking-[0.05em] text-on-surface/50 uppercase mb-2">Application Status</label>
                          <select 
                            className="w-full px-3 py-2 bg-surface text-sm font-bold text-on-surface rounded-xl border border-outline-variant/20 outline-none cursor-pointer focus:ring-2 focus:border-primary/50 focus:ring-primary/20"
                            value={filterResult}
                            onChange={(e) => dispatch({ type: 'SET_FILTER_RESULT', payload: e.target.value })}
                          >
                            <option value="all">All Statuses</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="No Response">No Response</option>
                            <option value="Hired">Hired (Assessed)</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Potential Talented">Potential</option>
                            <option value="Future Consideration">Future Consideration</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-primary text-on-primary font-bold text-sm rounded-xl active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dim"
                    onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
                  >
                    <Icon name="add" size="text-lg" /> Add Candidate
                  </button>
                </div>
              </div>

              {/* Stats Panel summary cards */}
              <StatsPanel candidates={candidates} />

              {/* Main Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Table */}
                <div className="lg:col-span-2">
                  <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden border border-outline-variant/10">
                    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
                      <h3 className="text-lg sm:text-xl font-bold text-on-surface whitespace-nowrap">Recent Candidates</h3>
                      <div className="relative w-full sm:max-w-sm">
                        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40" />
                        <input
                          className="w-full pl-12 pr-4 py-2.5 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface/40 text-sm outline-none transition-all focus:bg-surface-container-lowest"
                          placeholder="Search for candidates..."
                          value={searchTerm}
                          onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      {filtered.length === 0 ? (
                        <div className="text-center py-16">
                          <Icon name="inbox" size="text-5xl" className="opacity-20 mb-3" />
                          <p className="text-on-surface/40 text-sm font-bold uppercase tracking-widest">No candidates found</p>
                        </div>
                      ) : (
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[0.6875rem] uppercase tracking-widest text-on-surface/40 border-b border-outline-variant/5 bg-surface-container-lowest/50">
                              <th className="px-8 py-4 font-bold">Candidate</th>
                              <th className="px-8 py-4 font-bold">Level</th>
                              <th className="px-8 py-4 font-bold">Status</th>
                              <th className="px-8 py-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/5">
                            <AnimatePresence>
                              {filtered.map((c, i) => {
                                const badge = levelBadgeConfig[c.level] || levelBadgeConfig.Beginner;
                                const isConfirmed = c.interviewStatus === 'Confirmed';
                                const avatar = avatars[(i + 1) % avatars.length];
                                
                                return (
                                  <motion.tr
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2, delay: i * 0.05 }}
                                    key={c.id}
                                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                                    onClick={() => dispatch({ type: 'SELECT', payload: c })}
                                  >
                                  <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden group-hover:ring-2 ring-primary/20 transition-all">
                                        <img className="w-full h-full object-cover" src={avatar} alt="Avatar" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-on-surface text-sm">{c.name}</div>
                                        <div className="text-xs text-on-surface/50">{c.gmail}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <span className={`px-3 py-1 glass-float rounded-md text-xs font-bold border ${badge.color} ${badge.border}`}>
                                      {c.level}
                                    </span>
                                  </td>
                                  <td className="px-8 py-5">
                                    {c.interview?.result ? (
                                      <StatusDot label={c.interview.result} color={c.interview.result === 'Hired' ? '#006d4a' : '#ac3149'} />
                                    ) : (
                                      <StatusDot
                                        label={c.interviewStatus || 'No Response'}
                                        color={isConfirmed ? '#006d4a' : '#416188'}
                                      />
                                    )}
                                  </td>
                                  <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-1">
                                      <button 
                                        className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-colors" 
                                        title="Preview Profile"
                                        onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SELECT', payload: c }); }}
                                      >
                                        <Icon name="visibility" size="text-[20px]" />
                                      </button>
                                      {deleteConfirmId === c.id ? (
                                        <div className="flex items-center bg-error/10 text-error rounded-lg overflow-hidden animate-fade-in">
                                          <button 
                                            className="px-3 py-2 text-xs font-bold hover:bg-error/20 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_CANDIDATE', payload: c.id }); setDeleteConfirmId(null); }}
                                          >
                                            Confirm
                                          </button>
                                          <button 
                                            className="px-2 py-2 hover:bg-error/20 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                                          >
                                            <Icon name="close" size="text-[16px]" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button 
                                          className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-lg transition-colors" 
                                          title="Delete Candidate"
                                          onClick={(e) => { 
                                            e.stopPropagation(); 
                                            setDeleteConfirmId(c.id);
                                          }}
                                        >
                                          <Icon name="delete" size="text-[20px]" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                  </motion.tr>
                                );
                              })}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Rail: Breakdowns */}
                <div className="space-y-8">
                  <TalentDistribution candidates={candidates} />
                  <ApplicationHealth candidates={candidates} />

                  {/* Removed Activity Float Component */}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== Candidate Detail View ===== */}
          {view === 'detail' && selectedCandidate && (
            <motion.div 
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="py-4 sm:py-8 max-w-4xl mx-auto"
            >
              <CandidateDetail candidate={candidates.find((c) => c.id === selectedCandidate.id) || selectedCandidate} dispatch={dispatch} state={state} />
            </motion.div>
          )}

          {/* ===== Add/Edit Modals ===== */}
          {showForm && (
            <motion.div 
              key="add-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="py-4 sm:py-8 max-w-3xl mx-auto"
            >
              <CandidateForm dispatch={dispatch} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
