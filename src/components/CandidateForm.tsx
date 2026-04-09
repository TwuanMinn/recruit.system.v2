import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, type CandidateFormData } from '../schemas/candidate';
import { interviewSchema, type InterviewFormData } from '../schemas/interview';
import { useCandidateStore } from '../store/useCandidateStore';
import { Input, Sel, Btn, ConfirmPicker, Icon, TextArea } from './ui';
import { resultOptions } from '../constants';
import type { ResultValue, Candidate } from '../types';

interface Props {
  onSuccess?: () => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Step bar ──────────────────────────────────────────────────────────────────

const StepBar: React.FC<{ step: 1 | 2 | 3 }> = ({ step }) => {
  const pillColor = (n: number) =>
    step > n ? '#6c47ff' : step === n ? 'linear-gradient(90deg, #6c47ff, #38bdf8)' : '#e5e7eb';
  const lineColor = (afterN: number) => (step > afterN ? '#6c47ff' : '#e5e7eb');
  const labelColor = (n: number) => (step >= n ? '#6c47ff' : '#9ca3af');

  return (
    <div className="mb-6 w-full">
      {/* Row 1: pills + connecting lines */}
      <div className="flex items-center w-full">
        <div className="h-1 w-36 rounded-full shrink-0" style={{ background: pillColor(1) }} />
        <div className="h-px flex-1 transition-all" style={{ background: lineColor(1) }} />
        <div className="h-1 w-36 rounded-full shrink-0" style={{ background: pillColor(2) }} />
        <div className="h-px flex-1 transition-all" style={{ background: lineColor(2) }} />
        <div className="h-1 w-36 rounded-full shrink-0" style={{ background: pillColor(3) }} />
      </div>
      {/* Row 2: labels centered under each pill */}
      <div className="flex items-center mt-2">
        <span className="w-36 text-center text-sm font-semibold" style={{ color: labelColor(1) }}>Profile</span>
        <div className="flex-1" />
        <span className="w-36 text-center text-sm font-semibold" style={{ color: labelColor(2) }}>Assessment</span>
        <div className="flex-1" />
        <span className="w-36 text-center text-sm font-semibold" style={{ color: labelColor(3) }}>Results</span>
      </div>
    </div>
  );
};

// ── Result row for step 3 ────────────────────────────────────────────────────
const ResultRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) =>
  value ? (
    <div className="mb-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface/40 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-on-surface">{value}</p>
    </div>
  ) : null;

// ── Main wizard ───────────────────────────────────────────────────────────────
const CandidateForm: React.FC<Props> = ({ onSuccess }) => {
  const toggleForm = useCandidateStore((s) => s.toggleForm);
  const addCandidateComplete = useCandidateStore((s) => s.addCandidateComplete);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [candidateData, setCandidateData] = useState<CandidateFormData | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewFormData | null>(null);
  const [finalCandidate, setFinalCandidate] = useState<Candidate | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form 1: Candidate ──
  const {
    control: c1,
    handleSubmit: hs1,
    watch: w1,
    formState: { errors: e1 },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: '', phone: '', gmail: '', linkCV: '',
      level: 'Beginner', gender: 'Male', interviewStatus: 'No Response',
    },
  });

  // ── Form 2: Interview ──
  const {
    control: c2,
    handleSubmit: hs2,
    formState: { errors: e2 },
  } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      interviewDate: new Date().toISOString().split('T')[0],
      result: '', salaryExpectation: '', salaryType: 'monthly',
      strength: '', weakness: '', background: '', skill: '', yearsExp: '', note: '',
    },
  });

  const nameValue = w1('name');
  const initials = nameValue ? getInitials(nameValue) : 'JD';
  const displayName = nameValue.trim() || 'Jane Doe';

  // ── Handlers ──
  const onStep1Submit = (data: CandidateFormData) => {
    setCandidateData(data);
    setStep(2);
  };

  const onStep2Submit = (data: InterviewFormData) => {
    if (!candidateData) return;
    const candidate: Candidate = {
      ...candidateData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      interviewConfirmed: candidateData.interviewStatus === 'Confirmed',
      linkCV: candidateData.linkCV || '',
      activityLog: [],
      interview: {
        ...data,
        result: (data.result as ResultValue | '') || '',
        strength: data.strength || '',
        weakness: data.weakness || '',
        background: data.background || '',
        skill: data.skill || '',
        yearsExp: data.yearsExp || '',
        note: data.note || '',
        salaryExpectation: data.salaryExpectation || '',
      },
    };
    setInterviewData(data);
    setFinalCandidate(candidate);
    setStep(3);
  };

  const onFinish = () => {
    if (!finalCandidate) return;
    setShowSuccess(true);
    setTimeout(() => {
      addCandidateComplete(finalCandidate);
      onSuccess?.();
    }, 1800);
  };

  const resultLabel = resultOptions.find((o) => o.value === interviewData?.result)?.label;

  // ── Shared gradient header ──
  const header = (
    <div
      className="relative px-6 pt-5 pb-12"
      style={{ background: 'linear-gradient(135deg, #6c47ff 0%, #a78bfa 60%, #38bdf8 100%)' }}
    >
      <div className="flex justify-between items-start mb-5">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
        >
          <span className="relative flex shrink-0 w-2 h-2">
            <span className="radar-ring" />
            <span className="radar-ring radar-ring-2" />
            <span className="radar-ring radar-ring-3" />
            <span className="relative inline-flex rounded-full w-2 h-2 bg-green-400" />
          </span>
          New candidate
        </div>
        <button type="button" onClick={toggleForm} className="text-white/60 hover:text-white transition-colors" aria-label="Close">
          <Icon name="close" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', border: '3px solid rgba(255,255,255,0.8)' }}
        >
          {step === 1 ? initials : (candidateData ? getInitials(candidateData.name) : 'JD')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-lg leading-tight truncate">
            {step === 1 ? displayName : candidateData?.name}
          </p>
          <p className="text-white/60 text-xs mt-0.5">
            {step === 1 ? 'Profile Photo (optional)' : step === 2 ? 'Record Assessment' : 'Summary'}
          </p>
        </div>
        {step === 1 && (
          <label
            className="cursor-pointer px-3 py-1.5 rounded-lg text-white text-xs font-medium shrink-0 transition-opacity hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            Upload Photo
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" />
          </label>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-[2rem]" />
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden relative bg-white dark:bg-slate-900" style={{ boxShadow: '0 20px 60px rgba(108,71,255,0.15)' }} role="dialog" aria-label="Add new candidate">

      {/* ── Success overlay ── */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl animate-success-bg"
          style={{ background: 'linear-gradient(135deg, #6c47ff 0%, #a78bfa 60%, #38bdf8 100%)' }}>
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="mb-6">
            {/* White filled background circle */}
            <circle cx="55" cy="55" r="50" fill="white" />
            {/* Outer ring */}
            <circle cx="55" cy="55" r="50" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
            <circle cx="55" cy="55" r="50" stroke="white" strokeWidth="4" strokeLinecap="round" className="animate-check-circle" style={{ strokeDasharray: 314, strokeDashoffset: 314 }} />
            {/* Bold gradient-colored checkmark */}
            <polyline points="30,57 47,74 80,36" stroke="url(#ckGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="animate-check-mark" />
            <defs>
              <linearGradient id="ckGrad" x1="30" y1="55" x2="80" y2="55" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6c47ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="circlGrad" x1="0" y1="0" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6c47ff" />
                <stop offset="60%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <p className="text-white text-2xl font-bold animate-success-text">Candidate Saved!</p>
          <p className="text-white/70 text-sm mt-1 animate-success-text" style={{ animationDelay: '0.45s' }}>
            {finalCandidate?.name} has been added successfully.
          </p>
        </div>
      )}

      {header}

      <div className="px-6 pb-6">
        <StepBar step={step} />

        {/* ── STEP 1: Candidate form ── */}
        {step === 1 && (
          <form key="step1" className="animate-step-in" onSubmit={hs1(onStep1Submit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-1">
              <Controller name="name" control={c1} render={({ field }) => <Input label="Full Name *" placeholder="Jane Doe" {...field} error={e1.name?.message} autoFocus />} />
              <Controller name="phone" control={c1} render={({ field }) => <Input label="Phone Number *" placeholder="+1 (555) 000-0000" {...field} error={e1.phone?.message} />} />
              <Controller name="gmail" control={c1} render={({ field }) => <Input label="Email Address *" placeholder="jane.doe@example.com" type="email" {...field} error={e1.gmail?.message} />} />
              <Controller name="linkCV" control={c1} render={({ field }) => <Input label="Resume / Portfolio" placeholder="https://..." {...field} error={e1.linkCV?.message} />} />
              <Controller name="gender" control={c1} render={({ field }) => <Sel label="Gender" {...field} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />} />
              <Controller name="level" control={c1} render={({ field }) => <Sel label="Seniority Level" {...field} options={[{ value: 'Senior', label: 'Senior' }, { value: 'Beginner', label: 'Beginner' }, { value: 'Newbie', label: 'Newbie' }]} />} />
            </div>
            <div className="mb-5 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20">
              <Controller name="interviewStatus" control={c1} render={({ field: { value, onChange } }) => <ConfirmPicker value={value} onChange={onChange} />} />
            </div>
            <div className="flex gap-3">
              <Btn type="submit" className="flex-1 justify-center btn-cta" icon="arrow_forward">Save Profile</Btn>
              <Btn type="button" variant="tonal" onClick={toggleForm}>Cancel</Btn>
            </div>
          </form>
        )}

        {/* ── STEP 2: Assessment form ── */}
        {step === 2 && (
          <form key="step2" className="animate-step-in" onSubmit={hs2(onStep2Submit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 mb-1">
              <Controller name="interviewDate" control={c2} render={({ field }) => <Input label="Interview Date" type="date" {...field} error={e2.interviewDate?.message} />} />
              <Controller name="result" control={c2} render={({ field }) => <Sel label="Final Decision" {...field} options={resultOptions} />} />
            </div>

            <div className="mb-4 p-4 rounded-2xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/50">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#15803d' }}>
                <Icon name="monetization_on" className="text-sm" /> Compensation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <Controller name="salaryExpectation" control={c2} render={({ field }) => <Input label="Expectation Amount" placeholder="Eg: 5000 or Negotiable" {...field} />} />
                <Controller name="salaryType" control={c2} render={({ field }) => <Sel label="Frequency" {...field} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <Controller name="strength" control={c2} render={({ field }) => <TextArea label="Strengths Overview" placeholder="Detailed strengths..." {...field} />} />
              <Controller name="weakness" control={c2} render={({ field }) => <TextArea label="Areas for Improvement" placeholder="Observed weaknesses..." {...field} />} />
              <Controller name="background" control={c2} render={({ field }) => <TextArea label="Educational / Professional Background" placeholder="Previous history..." {...field} />} />
              <Controller name="skill" control={c2} render={({ field }) => <TextArea label="Technical / Soft Skills" placeholder="List of skills..." {...field} />} />
              <Controller name="yearsExp" control={c2} render={({ field }) => <Input label="Total Years Experience" type="number" {...field} error={e2.yearsExp?.message} />} />
              <Controller name="note" control={c2} render={({ field }) => <TextArea label="Final HR Remarks" placeholder="Private notes..." {...field} />} />
            </div>

            <div className="flex gap-3 mt-2">
              <Btn type="submit" className="flex-1 justify-center btn-cta" variant="primary" icon="check" style={{ background: 'linear-gradient(135deg, #6c47ff 0%, #a78bfa 60%, #38bdf8 100%)' }}>Commit Assessment</Btn>
              <Btn type="button" variant="tonal" onClick={() => setStep(1)}>← Back</Btn>
              <Btn type="button" variant="tonal" onClick={toggleForm}>Cancel</Btn>
            </div>
          </form>
        )}

        {/* ── STEP 3: Results summary ── */}
        {step === 3 && finalCandidate && (
          <div key="step3" className="animate-step-in">
            {/* Profile section */}
            <div className="mb-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1.5">
                <Icon name="person" className="text-sm" /> Candidate Profile
              </p>
              <div className="grid grid-cols-2 gap-x-6">
                <ResultRow label="Full Name" value={finalCandidate.name} />
                <ResultRow label="Phone" value={finalCandidate.phone} />
                <ResultRow label="Email" value={finalCandidate.gmail} />
                <ResultRow label="Resume" value={finalCandidate.linkCV || '—'} />
                <ResultRow label="Gender" value={finalCandidate.gender} />
                <ResultRow label="Seniority" value={finalCandidate.level} />
                <ResultRow label="Interview Status" value={finalCandidate.interviewStatus} />
              </div>
            </div>

            {/* Assessment section */}
            {finalCandidate.interview && (
              <div className="mb-4 p-4 rounded-2xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/50">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#15803d' }}>
                  <Icon name="assessment" className="text-sm" /> Assessment
                </p>
                <div className="grid grid-cols-2 gap-x-6">
                  <ResultRow label="Interview Date" value={finalCandidate.interview.interviewDate} />
                  <ResultRow label="Final Decision" value={resultLabel || '—'} />
                  <ResultRow label="Salary Expectation" value={finalCandidate.interview.salaryExpectation ? `${finalCandidate.interview.salaryExpectation} (${finalCandidate.interview.salaryType})` : '—'} />
                  <ResultRow label="Years Experience" value={finalCandidate.interview.yearsExp || '—'} />
                  <ResultRow label="Strengths" value={finalCandidate.interview.strength || '—'} />
                  <ResultRow label="Areas for Improvement" value={finalCandidate.interview.weakness || '—'} />
                  <ResultRow label="Background" value={finalCandidate.interview.background || '—'} />
                  <ResultRow label="Skills" value={finalCandidate.interview.skill || '—'} />
                  <ResultRow label="HR Remarks" value={finalCandidate.interview.note || '—'} />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Btn type="button" className="flex-1 justify-center btn-cta" icon="check_circle" onClick={onFinish}>Confirm & Save</Btn>
              <Btn type="button" variant="tonal" onClick={() => setStep(2)}>← Edit</Btn>
              <Btn type="button" variant="tonal" onClick={toggleForm}>Cancel</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateForm;
