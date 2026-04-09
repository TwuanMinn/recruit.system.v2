import React from 'react';
import type { Candidate } from '../types';
import { Badge, StatusDot, Icon, Btn, Avatar } from './ui';
import { exportCandidatePDF } from '../pdf';
import EditCandidateForm from './EditCandidateForm';
import InterviewForm from './InterviewForm';
import ActivityTimeline from './ActivityTimeline';
import toast from 'react-hot-toast';
import { useCandidateStore } from '../store/useCandidateStore';

interface Props {
  candidate: Candidate;
}

const CandidateDetail: React.FC<Props> = ({ candidate }) => {
  const setView = useCandidateStore((s) => s.setView);
  const toggleEditCandidate = useCandidateStore((s) => s.toggleEditCandidate);
  const toggleInterview = useCandidateStore((s) => s.toggleInterview);
  const showEditCandidate = useCandidateStore((s) => s.showEditCandidate);
  const showInterview = useCandidateStore((s) => s.showInterview);

  const iv = candidate.interview;
  const isConfirmed = candidate.interviewStatus === 'Confirmed';

  return (
    <div className="space-y-6">
      {/* Detail Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('list')}
            className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
            aria-label="Back to candidate list"
          >
            <Icon name="arrow_back" />
          </button>
          <Avatar name={candidate.name} id={candidate.id} size="w-12 h-12 text-sm" />
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
          <Btn className="w-full sm:w-auto justify-center" variant="ghost" icon="picture_as_pdf" onClick={() => { exportCandidatePDF(candidate); toast.success('PDF exported'); }}>
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
                  <Badge
                    label={`Result: ${iv.result}`}
                    colors={{
                      text: iv.result === 'Rejected' ? 'var(--status-denied)' : 'var(--status-confirmed)',
                      border: iv.result === 'Rejected' ? 'var(--status-denied)' : 'var(--status-confirmed)',
                      bg: 'transparent'
                    }}
                  />
                ) : (
                  <StatusDot
                    label={candidate.interviewStatus === 'Rejected' ? 'Denied' : (candidate.interviewStatus || 'No Response')}
                    color={isConfirmed ? 'var(--status-confirmed)' : 'var(--status-denied)'}
                  />
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

              <div>
                <div className="text-[0.625rem] font-bold text-on-surface/40 uppercase tracking-widest mb-1">Added</div>
                <div className="text-sm font-medium text-on-surface/60">{candidate.createdAt}</div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline activityLog={candidate.activityLog || []} />
        </div>

        {/* Right Column: Assessment */}
        <div className="lg:col-span-2">
          {iv ? (
            <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10 animate-fade-in">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Interview Assessment</h3>
                  <div className="text-xs font-bold text-on-surface/50">Date: {iv.interviewDate}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Btn variant="ghost" icon="edit" onClick={toggleEditCandidate}>
                    Edit Form
                  </Btn>
                  <Btn variant="tonal" icon="edit_note" onClick={toggleInterview}>
                    Edit Notes
                  </Btn>
                </div>
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
          ) : (
            <div className="bg-surface-container-lowest p-8 rounded-xl card-shadow border border-outline-variant/10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-surface-container rounded-2xl flex items-center justify-center">
                <Icon name="rate_review" size="text-3xl" className="text-on-surface/20" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">No Assessment Yet</h3>
              <p className="text-sm text-on-surface/50 mb-6">Record the first interview assessment for this candidate.</p>
              <Btn icon="add" onClick={toggleInterview}>Start Assessment</Btn>
            </div>
          )}
        </div>
      </div>

      {showEditCandidate && <EditCandidateForm candidate={candidate} onSuccess={() => toast.success('Profile updated')} />}
      {showInterview && <InterviewForm candidate={candidate} onSuccess={() => toast.success('Assessment saved')} />}
    </div>
  );
};

export default CandidateDetail;
