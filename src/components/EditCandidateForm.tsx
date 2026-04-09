import React, { useState } from 'react';
import type { AppAction, Candidate, Level, Gender, InterviewStatus } from '../types';
import { Input, Sel, Btn, ConfirmPicker } from './ui';

interface Props {
  candidate: Candidate;
  dispatch: React.Dispatch<AppAction>;
}

const EditCandidateForm: React.FC<Props> = ({ candidate, dispatch }) => {
  const [f, setF] = useState({
    name: candidate.name,
    phone: candidate.phone,
    gmail: candidate.gmail,
    linkCV: candidate.linkCV || '',
    level: candidate.level as Level,
    gender: (candidate.gender || 'Male') as Gender,
    interviewStatus: (candidate.interviewStatus || 'No Response') as InterviewStatus,
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = () => {
    if (!f.name || !f.phone || !f.gmail) return alert('Please fill Name, Phone, Gmail.');
    dispatch({
      type: 'UPDATE_CANDIDATE',
      payload: {
        ...candidate,
        ...f,
        interviewConfirmed: f.interviewStatus === 'Confirmed',
      },
    });
  };

  return (
    <div className="animate-slide-down bg-white rounded-2xl p-7 shadow-elevated border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm">✏️</span>
          Edit — {candidate.name}
        </h3>
        <Btn variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_EDIT_CANDIDATE' })} className="!p-2 !rounded-lg">
          ✕
        </Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Input label="Full Name *" value={f.name} onChange={set('name')} />
        <Input label="Phone *" value={f.phone} onChange={set('phone')} />
        <Input label="Gmail *" value={f.gmail} onChange={set('gmail')} />
        <Input label="Link CV" value={f.linkCV} onChange={set('linkCV')} />
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
        <Btn variant="success" onClick={submit}>
          ✅ Save Changes
        </Btn>
        <Btn variant="ghost" onClick={() => dispatch({ type: 'TOGGLE_EDIT_CANDIDATE' })}>
          Cancel
        </Btn>
      </div>
    </div>
  );
};

export default EditCandidateForm;
