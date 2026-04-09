import React, { useState } from 'react';
import type { AppAction, Candidate } from '../types';
import { resultOptions } from '../constants';
import { Input, TextArea, Sel, Btn, Icon } from './ui';

interface Props {
  candidate: Candidate;
  dispatch: React.Dispatch<AppAction>;
}

const InterviewForm: React.FC<Props> = ({ candidate, dispatch }) => {
  const ex = candidate.interview || ({} as any);
  const [f, setF] = useState({
    strength: ex.strength || '',
    weakness: ex.weakness || '',
    background: ex.background || '',
    skill: ex.skill || '',
    yearsExp: ex.yearsExp || '',
    result: ex.result || '',
    note: ex.note || '',
    interviewDate: ex.interviewDate || new Date().toISOString().split('T')[0],
    salaryExpectation: ex.salaryExpectation || '',
    salaryType: ex.salaryType || 'monthly',
  });

  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  const submit = () => dispatch({ type: 'UPDATE_CANDIDATE', payload: { ...candidate, interview: f as any } });

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10 mt-8 relative z-50 shadow-[0_20px_50px_-12px_rgba(13,52,89,0.15)] animate-fade-in">
      <div className="flex justify-between items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-outline-variant/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-on-surface">Record Assessment</h2>
          <p className="text-xs font-bold tracking-widest text-on-surface/40 uppercase mt-1">For {candidate.name}</p>
        </div>
        <button onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })} className="p-2 bg-surface text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
          <Icon name="close" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
        <Input label="Interview Date" type="date" value={f.interviewDate} onChange={set('interviewDate')} />
        <Sel label="Final Decision" value={f.result} onChange={set('result')} options={resultOptions} />
      </div>

      <div className="bg-secondary-container/10 border border-secondary-container/20 p-4 sm:p-6 rounded-xl mb-6">
        <h4 className="text-[0.625rem] font-bold text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
          <Icon name="monetization_on" size="text-sm" /> Compensation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Expectation Amount" type="text" placeholder="Eg: 5000 or Negotiable" value={f.salaryExpectation} onChange={set('salaryExpectation')} />
          <Sel label="Frequency" value={f.salaryType} onChange={set('salaryType')} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TextArea label="Strengths Overview" placeholder="Detailed strengths..." value={f.strength} onChange={set('strength')} />
        <TextArea label="Areas for Improvement" placeholder="Observed weaknesses..." value={f.weakness} onChange={set('weakness')} />
        <TextArea label="Educational/Professional Background" placeholder="Previous history..." value={f.background} onChange={set('background')} />
        <TextArea label="Technical/Soft Skills" placeholder="List of skills..." value={f.skill} onChange={set('skill')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Input label="Total Years Experience" type="number" value={f.yearsExp} onChange={set('yearsExp')} />
        <TextArea label="Final HR Remarks" placeholder="Private notes..." value={f.note} onChange={set('note')} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-outline-variant/5">
        <Btn className="w-full sm:w-auto justify-center" icon="check" variant="success" onClick={submit}>Commit Assessment</Btn>
        <Btn className="w-full sm:w-auto justify-center" variant="tonal" onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })}>Cancel</Btn>
      </div>
    </div>
  );
};
export default InterviewForm;
