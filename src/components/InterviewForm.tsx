import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { interviewSchema, type InterviewFormData } from '../schemas/interview';
import { useCandidateStore } from '../store/useCandidateStore';
import { resultOptions } from '../constants';
import type { Candidate, ResultValue } from '../types';
import { Input, TextArea, Sel, Btn, Icon } from './ui';

interface Props {
  candidate: Candidate;
  onSuccess?: () => void;
}

const InterviewForm: React.FC<Props> = ({ candidate, onSuccess }) => {
  const toggleInterview = useCandidateStore((s) => s.toggleInterview);
  const updateCandidate = useCandidateStore((s) => s.updateCandidate);

  const existing = candidate.interview;

  const { control, handleSubmit, formState: { errors } } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      interviewDate: existing?.interviewDate || new Date().toISOString().split('T')[0],
      result: existing?.result || '',
      salaryExpectation: existing?.salaryExpectation || '',
      salaryType: existing?.salaryType || 'monthly',
      strength: existing?.strength || '',
      weakness: existing?.weakness || '',
      background: existing?.background || '',
      skill: existing?.skill || '',
      yearsExp: existing?.yearsExp || '',
      note: existing?.note || '',
    },
  });

  const onSubmit = (data: InterviewFormData) => {
    updateCandidate({
      ...candidate,
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
    });
    onSuccess?.();
  };

  return (
    <div
      className="bg-surface-container-lowest p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10 mt-8 relative z-50 shadow-[0_20px_50px_-12px_rgba(13,52,89,0.15)] animate-fade-in"
      role="dialog"
      aria-label={`Interview assessment for ${candidate.name}`}
    >
      <div className="flex justify-between items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-outline-variant/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface">Record Assessment</h2>
          <p className="text-xs font-bold tracking-widest text-on-surface/40 uppercase mt-1">For {candidate.name}</p>
        </div>
        <button type="button" onClick={toggleInterview} className="p-2 bg-surface text-on-surface hover:bg-surface-container-high rounded-full transition-colors" aria-label="Close assessment form">
          <Icon name="close" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <Controller name="interviewDate" control={control} render={({ field }) => <Input label="Interview Date" type="date" {...field} error={errors.interviewDate?.message} />} />
          <Controller name="result" control={control} render={({ field }) => <Sel label="Final Decision" {...field} options={resultOptions} />} />
        </div>

        <div className="bg-secondary-container/10 border border-secondary-container/20 p-4 sm:p-6 rounded-xl mb-6">
          <h4 className="text-[0.625rem] font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
            <Icon name="monetization_on" size="text-sm" /> Compensation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller name="salaryExpectation" control={control} render={({ field }) => <Input label="Expectation Amount" type="text" placeholder="Eg: 5000 or Negotiable" {...field} />} />
            <Controller name="salaryType" control={control} render={({ field }) => <Sel label="Frequency" {...field} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Controller name="strength" control={control} render={({ field }) => <TextArea label="Strengths Overview" placeholder="Detailed strengths..." {...field} />} />
          <Controller name="weakness" control={control} render={({ field }) => <TextArea label="Areas for Improvement" placeholder="Observed weaknesses..." {...field} />} />
          <Controller name="background" control={control} render={({ field }) => <TextArea label="Educational/Professional Background" placeholder="Previous history..." {...field} />} />
          <Controller name="skill" control={control} render={({ field }) => <TextArea label="Technical/Soft Skills" placeholder="List of skills..." {...field} />} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Controller name="yearsExp" control={control} render={({ field }) => <Input label="Total Years Experience" type="number" {...field} error={errors.yearsExp?.message} />} />
          <Controller name="note" control={control} render={({ field }) => <TextArea label="Final HR Remarks" placeholder="Private notes..." {...field} />} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-outline-variant/5">
          <Btn type="submit" className="w-full sm:w-auto justify-center" icon="check" variant="success">Commit Assessment</Btn>
          <Btn type="button" className="w-full sm:w-auto justify-center" variant="tonal" onClick={toggleInterview}>Cancel</Btn>
        </div>
      </form>
    </div>
  );
};
export default InterviewForm;
