import React, { useState } from 'react';
import type { AppAction } from '../types';
import { Input, Sel, Btn, ConfirmPicker, Icon } from './ui';

interface Props {
  dispatch: React.Dispatch<AppAction>;
}

const CandidateForm: React.FC<Props> = ({ dispatch }) => {
  const [f, setF] = useState({
    name: '',
    phone: '',
    gmail: '',
    linkCV: '',
    level: 'Beginner' as any,
    gender: 'Male' as any,
    interviewStatus: 'No Response' as any,
  });

  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  const submit = () => {
    if (!f.name || !f.phone || !f.gmail) return alert('Please fill Name, Phone, Gmail.');
    dispatch({
      type: 'ADD_CANDIDATE',
      payload: { ...f, id: Date.now().toString(), createdAt: new Date().toLocaleDateString(), interviewConfirmed: f.interviewStatus === 'Confirmed', interview: null },
    });
  };

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/5">
        <div>
          <h2 className="text-2xl font-black text-on-surface">Add New Candidate</h2>
          <p className="text-xs font-bold tracking-widest text-on-surface/40 uppercase mt-1">Profile Details</p>
        </div>
        <button onClick={() => dispatch({ type: 'TOGGLE_FORM' })} className="p-2 bg-surface text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
          <Icon name="close" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Input label="Full Name *" placeholder="Jane Doe" value={f.name} onChange={set('name')} />
        <Input label="Phone Number *" placeholder="+1 (555) 000-0000" value={f.phone} onChange={set('phone')} />
        <Input label="Email Address *" placeholder="jane.doe@example.com" value={f.gmail} onChange={set('gmail')} />
        <Input label="Resume / Portfolio Link" placeholder="https://..." value={f.linkCV} onChange={set('linkCV')} />
        <Sel label="Gender" value={f.gender} onChange={set('gender')} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />
        <Sel label="Seniority Level" value={f.level} onChange={set('level')} options={[{ value: 'Senior', label: 'Senior' }, { value: 'Beginner', label: 'Beginner' }, { value: 'Newbie', label: 'Newbie' }]} />
      </div>

      <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-surface-container-low rounded-xl">
        <ConfirmPicker value={f.interviewStatus} onChange={(v) => setF({ ...f, interviewStatus: v })} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Btn className="w-full sm:w-auto justify-center" icon="save" onClick={submit}>Save Profile</Btn>
        <Btn className="w-full sm:w-auto justify-center" variant="tonal" onClick={() => dispatch({ type: 'TOGGLE_FORM' })}>Cancel</Btn>
      </div>
    </div>
  );
};
export default CandidateForm;
