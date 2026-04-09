import React, { useState } from 'react';
import type { AppAction, Candidate, Interview } from '../types';
import { resultOptions } from '../constants';
import { Input, TextArea, Sel, Btn } from './ui';

interface Props {
  candidate: Candidate;
  dispatch: React.Dispatch<AppAction>;
}

const InterviewForm: React.FC<Props> = ({ candidate, dispatch }) => {
  const ex = candidate.interview || ({} as Partial<Interview>);
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

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = () =>
    dispatch({
      type: 'UPDATE_CANDIDATE',
      payload: { ...candidate, interview: f as Interview },
    });

  return (
    <div className="animate-slide-down bg-white rounded-2xl p-7 shadow-elevated border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">📋</span>
          Assessment — {candidate.name}
        </h3>
        <Btn variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })} className="!p-2 !rounded-lg">
          ✕
        </Btn>
      </div>

      <Input label="Interview Date" type="date" value={f.interviewDate} onChange={set('interviewDate')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <TextArea label="Strengths" placeholder="Communication, leadership..." value={f.strength} onChange={set('strength')} />
        <TextArea label="Weaknesses" placeholder="Time management..." value={f.weakness} onChange={set('weakness')} />
        <TextArea label="Background" placeholder="CS degree, 3 years at..." value={f.background} onChange={set('background')} />
        <TextArea label="Skills" placeholder="React, Node.js, Python..." value={f.skill} onChange={set('skill')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Input label="Years of Experience" type="number" placeholder="3" value={f.yearsExp} onChange={set('yearsExp')} />
        <Sel label="Result" value={f.result} onChange={set('result')} options={resultOptions} />
      </div>

      {/* Salary box */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5 mb-4">
        <div className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
          💰 Salary Expectation
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-x-4">
          <Input label="Amount (USD)" type="number" placeholder="2000" value={f.salaryExpectation} onChange={set('salaryExpectation')} />
          <Sel
            label="Type"
            value={f.salaryType}
            onChange={set('salaryType')}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
        </div>
      </div>

      <TextArea label="Notes" placeholder="Additional observations..." value={f.note} onChange={set('note')} />

      <div className="flex gap-3 mt-2">
        <Btn variant="success" onClick={submit}>
          ✅ Save Assessment
        </Btn>
        <Btn variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_INTERVIEW' })}>
          Cancel
        </Btn>
      </div>
    </div>
  );
};

export default InterviewForm;
