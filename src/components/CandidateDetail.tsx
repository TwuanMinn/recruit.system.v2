import React from 'react';
import type { AppAction, AppState, Candidate } from '../types';
import { Badge, StatusDot, Icon, Btn } from './ui';
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
  const isConfirmed = candidate.interviewStatus === 'Confirmed';

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'list' })}
          className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
            {candidate.name}
            {candidate.gender === 'Male' && <Icon name="male" className="text-secondary" size="text-xl" />}
            {candidate.gender === 'Female' && <Icon name="female" className="text-error" size="text-xl" />}
          </h2>
          <p className="text-on-surface/50 text-sm mt-0.5">{candidate.gmail} • {candidate.phone}</p>
        </div>
        </div>
        <div className="w-full sm:mx-0 sm:ml-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Btn className="w-full sm:w-auto justify-center" variant="tonal" icon="edit" onClick={() => dispatch({ type: 'TOGGLE_EDIT_CANDIDATE' })}>
            Edit Form
          </Btn>
          <Btn className="w-full sm:w-auto justify-center" variant="ghost" icon="picture_as_pdf" onClick={() => exportCandidatePDF(candidate)}>
            Export PDF
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl card-shadow border border-outline-variant/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface/40 mb-5">Profile Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-[0.625rem] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Status</div>
                {iv?.result ? (
                  <Badge label={`Result: ${iv.result}`} colors={{ text: '#006d4a', border: '#006d4a', bg: 'transparent' }} />
                ) : (
                  <StatusDot label={candidate.interviewStatus || 'No Response'} color={isConfirmed ? '#006d4a' : '#416188'} />
                )}
              </div>
              
              <div>
                <div className="text-[0.625rem] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Level</div>
                <div className="text-sm font-bold text-on-surface">{candidate.level}</div>
              </div>

              {candidate.linkCV && (
                <div>
                  <div className="text-[0.625rem] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Resume / CV</div>
                  <a href={candidate.linkCV} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                    View Document <Icon name="open_in_new" size="text-[14px]" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Assessment */}
        <div className="lg:col-span-2">
          {iv && (
            <div className="bg-surface-container-lowest p-8 rounded-xl card-shadow border border-outline-variant/10 animate-fade-in">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Interview Assessment</h3>
                  <div className="text-xs font-bold text-on-surface/50">Date: {iv.interviewDate}</div>
                </div>
                <Btn variant="tonal" icon="edit_note" onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })}>
                  Edit Notes
                </Btn>
              </div>

              {iv.salaryExpectation && (
                <div className="bg-secondary-container/20 p-5 rounded-xl border border-secondary-container mb-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-container text-secondary rounded-xl flex items-center justify-center">
                    <Icon name="payments" />
                  </div>
                  <div>
                    <div className="text-[0.625rem] font-bold text-on-surface/40 uppercase tracking-widest">Expected Salary</div>
                    <div className="text-2xl font-black text-secondary mt-0.5">
                      {isNaN(Number(iv.salaryExpectation)) 
                        ? iv.salaryExpectation 
                        : `$${Number(iv.salaryExpectation).toLocaleString('en-US')}`
                      }
                      <span className="text-sm font-bold opacity-60">
                        {iv.salaryType === 'monthly' ? ' / mo' : ' / yr'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: 'thumb_up', title: 'Strengths', content: iv.strength, color: 'text-secondary' },
                  { icon: 'warning', title: 'Weaknesses', content: iv.weakness, color: 'text-error' },
                  { icon: 'school', title: 'Background', content: iv.background, color: 'text-tertiary' },
                  { icon: 'build', title: 'Core Skills', content: iv.skill, color: 'text-primary' },
                ].map((sec) => sec.content && (
                  <div key={sec.title} className="bg-surface p-5 rounded-xl border border-outline-variant/5">
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${sec.color} mb-3`}>
                      <Icon name={sec.icon} size="text-[16px]" /> {sec.title}
                    </div>
                    <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{sec.content}</p>
                  </div>
                ))}
              </div>

              {(iv.yearsExp || iv.note) && (
                <div className="bg-surface-container-low p-6 rounded-xl border-l-[3px] border-primary">
                  {iv.yearsExp && (
                    <div className="mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-on-surface/40">Experience:</span>
                      <span className="text-sm font-bold ml-2">{iv.yearsExp} Years</span>
                    </div>
                  )}
                  {iv.note && (
                    <div>
                      <div className="flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface/40 mb-2">
                        <Icon name="notes" size="text-[14px]" /> Additional Notes
                      </div>
                      <p className="text-sm text-on-surface font-medium leading-relaxed italic">{iv.note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {state.showEditCandidate && <EditCandidateForm candidate={candidate} dispatch={dispatch} />}
      {state.showInterview && <InterviewForm candidate={candidate} dispatch={dispatch} />}
    </div>
  );
};

export default CandidateDetail;
