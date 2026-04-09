import React, { useState } from 'react';
import type { AppAction, Level, Gender, InterviewStatus } from '../types';
import { Input, Sel, Btn, ConfirmPicker } from './ui';

interface Props {
  dispatch: React.Dispatch<AppAction>;
}

const CandidateForm: React.FC<Props> = ({ dispatch }) => {
  const [f, setF] = useState({
    name: '',
    phone: '',
    gmail: '',
    linkCV: '',
    level: 'Beginner' as Level,
    gender: 'Male' as Gender,
    interviewStatus: 'No Response' as InterviewStatus,
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = () => {
    if (!f.name || !f.phone || !f.gmail) return alert('Please fill Name, Phone, Gmail.');
    dispatch({
      type: 'ADD_CANDIDATE',
      payload: {
        ...f,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString(),
        interviewConfirmed: f.interviewStatus === 'Confirmed',
        interview: null,
      },
    });
  };

  return (
    <div className="animate-slide-down bg-white rounded-2xl p-7 shadow-elevated border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center text-sm">➕</span>
          New Candidate
        </h3>
        <Btn variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_FORM' })} className="!p-2 !rounded-lg">
          ✕
        </Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Input label="Full Name *" placeholder="Nguyen Van A" value={f.name} onChange={set('name')} />
        <Input label="Phone Number *" placeholder="0901234567" value={f.phone} onChange={set('phone')} />
        <Input label="Gmail *" placeholder="email@gmail.com" value={f.gmail} onChange={set('gmail')} />
        <Input label="Link CV" placeholder="https://drive.google.com/..." value={f.linkCV} onChange={set('linkCV')} />
        <Sel
          label="Gender"
          value={f.gender}
          onChange={set('gender')}
          options={[
            { value: 'Male', label: '♂️ Male' },
            { value: 'Female', label: '♀️ Female' },
            { value: 'Other', label: '⚧ Other' },
          ]}
        />
        <Sel
          label="Level"
          value={f.level}
          onChange={set('level')}
          options={[
            { value: 'Senior', label: '🔴 Senior' },
            { value: 'Beginner', label: '🔵 Beginner' },
            { value: 'Newbie', label: '🟣 Newbie' },
          ]}
        />
      </div>
      <ConfirmPicker value={f.interviewStatus} onChange={(v) => setF({ ...f, interviewStatus: v })} />
      <div className="flex gap-3 mt-2">
        <Btn onClick={submit}>💾 Save Candidate</Btn>
        <Btn variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_FORM' })}>
          Cancel
        </Btn>
      </div>
    </div>
  );
};

export default CandidateForm;
