import React from 'react';
import type { AppAction, AppState, Candidate } from '../types';
import { genderIcons, confirmColors, resultColors } from '../constants';
import { Badge, Btn, formatSalary } from './ui';
import { exportCandidatePDF } from '../pdf';
import EditCandidateForm from './EditCandidateForm';
import InterviewForm from './InterviewForm';

interface Props {
  candidate: Candidate;
  dispatch: React.Dispatch<AppAction>;
  state: AppState;
}

const CandidateDetail: React.FC<Props> = ({ candidate, dispatch, state }) => {
  const iv = candidate.interview;
  const sal = iv?.salaryExpectation
    ? `$${formatSalary(iv.salaryExpectation)}${iv.salaryType === 'monthly' ? ' /month' : ' /year'}`
    : null;
  const cs = confirmColors[candidate.interviewStatus] || confirmColors['No Response'];

  return (
    <div className="animate-fade-up">
      {/* Back button */}
      <button
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors duration-200 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        Back to List
      </button>

      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100">
        {/* ===== Header ===== */}
        <div className="relative bg-gradient-to-r from-brand-500 via-purple-500 to-violet-500 px-7 pt-8 pb-6 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative z-10 flex justify-between items-start flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                {candidate.name}
                {candidate.gender && (
                  <span className="text-lg opacity-70">{genderIcons[candidate.gender]}</span>
                )}
              </h2>
              <p className="text-white/70 mt-1.5 text-sm">
                Added {candidate.createdAt}
                {candidate.gender && ` • ${candidate.gender}`}
              </p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge
                label={candidate.level}
                colors={{ bg: 'rgba(255,255,255,0.15)', text: '#fff', border: 'rgba(255,255,255,0.3)' }}
              />
              <Badge
                label={`${cs.icon} ${candidate.interviewStatus || 'No Response'}`}
                colors={{ bg: 'rgba(255,255,255,0.15)', text: '#fff', border: 'rgba(255,255,255,0.3)' }}
              />
              <button
                onClick={() => dispatch({ type: 'TOGGLE_EDIT_CANDIDATE' })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => exportCandidatePDF(candidate)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
              >
                📄 PDF
              </button>
            </div>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="p-7">
          {/* Contact grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {[
              { icon: '📞', label: 'Phone', value: candidate.phone },
              { icon: '📧', label: 'Gmail', value: candidate.gmail },
              { icon: '👤', label: 'Gender', value: candidate.gender || 'N/A' },
              {
                icon: '📄',
                label: 'CV',
                value: candidate.linkCV ? (
                  <a href={candidate.linkCV} target="_blank" rel="noreferrer" className="text-brand-500 font-semibold hover:underline">
                    View CV ↗
                  </a>
                ) : (
                  'Not provided'
                ),
              },
            ].map((i) => (
              <div key={i.label} className="bg-gray-50 rounded-xl p-4 hover:bg-brand-50/50 transition-colors duration-200">
                <div className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                  {i.icon} {i.label}
                </div>
                <div className="text-sm font-medium text-gray-900 break-all">{i.value}</div>
              </div>
            ))}
          </div>

          {/* ===== Interview Assessment ===== */}
          {iv ? (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  📋 Interview Assessment
                </h3>
                <div className="flex gap-2 items-center">
                  {iv.result && (
                    <Badge
                      label={iv.result}
                      colors={resultColors[iv.result] || { bg: '#f3f4f6', text: '#374151' }}
                    />
                  )}
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })}
                    className="text-xs text-brand-500 font-semibold hover:text-brand-700 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">Date: {iv.interviewDate}</p>

              {/* Salary highlight */}
              {sal && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-5 text-center">
                  <div className="text-xs text-gray-400 mb-1">💰 Salary Expectation</div>
                  <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">{sal}</div>
                </div>
              )}

              {/* Assessment cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { l: '💪 Strengths', v: iv.strength },
                  { l: '⚠️ Weaknesses', v: iv.weakness },
                  { l: '🎓 Background', v: iv.background },
                  { l: '🛠 Skills', v: iv.skill },
                ].map(
                  (i) =>
                    i.v && (
                      <div key={i.l} className="bg-gray-50 rounded-xl p-4 hover:bg-brand-50/30 transition-colors duration-200">
                        <div className="text-xs text-gray-400 font-semibold mb-1.5">{i.l}</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{i.v}</div>
                      </div>
                    )
                )}
              </div>

              {iv.yearsExp && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <span className="text-xs text-gray-400">⏳ Experience: </span>
                  <span className="font-bold text-gray-800">{iv.yearsExp} years</span>
                </div>
              )}

              {iv.note && (
                <div className="bg-amber-50 rounded-xl p-4 border-l-[3px] border-amber-400">
                  <div className="text-xs text-amber-700 font-semibold mb-1.5">📝 Notes</div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{iv.note}</div>
                </div>
              )}
            </div>
          ) : (
            /* No interview placeholder */
            <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-3 opacity-50">📋</div>
              <p className="text-gray-400 mb-4 text-sm">No interview assessment yet</p>
              <Btn onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })}>Start Assessment</Btn>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex gap-3 mt-7 pt-5 border-t border-gray-100 flex-wrap">
            {!iv && (
              <Btn onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })}>📋 Add Assessment</Btn>
            )}
            <Btn
              variant="danger"
              onClick={() => {
                if (confirm('Delete this candidate?'))
                  dispatch({ type: 'DELETE_CANDIDATE', payload: candidate.id });
              }}
            >
              🗑 Delete
            </Btn>
          </div>
        </div>
      </div>

      {/* Inline forms */}
      {state.showEditCandidate && (
        <div className="mt-5">
          <EditCandidateForm candidate={candidate} dispatch={dispatch} />
        </div>
      )}
      {state.showInterview && (
        <div className="mt-5">
          <InterviewForm candidate={candidate} dispatch={dispatch} />
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
