import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, type CandidateFormData } from '../schemas/candidate';
import { useCandidateStore } from '../store/useCandidateStore';
import type { Candidate } from '../types';
import { Input, Sel, Btn, ConfirmPicker, Icon } from './ui';

interface Props {
  candidate: Candidate;
  onSuccess?: () => void;
}

const EditCandidateForm: React.FC<Props> = ({ candidate, onSuccess }) => {
  const toggleEditCandidate = useCandidateStore((state) => state.toggleEditCandidate);
  const updateCandidate = useCandidateStore((state) => state.updateCandidate);

  const { control, handleSubmit, formState: { errors } } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: candidate.name || '',
      phone: candidate.phone || '',
      gmail: candidate.gmail || '',
      linkCV: candidate.linkCV || '',
      level: candidate.level || 'Beginner',
      gender: candidate.gender || 'Male',
      interviewStatus: candidate.interviewStatus || 'No Response',
    },
  });

  const onSubmit = (data: CandidateFormData) => {
    updateCandidate({
      ...candidate,
      ...data,
      interviewConfirmed: data.interviewStatus === 'Confirmed',
      linkCV: data.linkCV || '',
    });
    onSuccess?.();
  };

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-8 rounded-xl card-shadow border border-outline-variant/10 mt-8 relative z-50" role="dialog" aria-label="Edit candidate profile">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-outline-variant/5">
        <div>
          <h2 className="text-2xl font-black text-on-surface">Edit Profile</h2>
          <p className="text-xs font-bold tracking-widest text-on-surface/40 uppercase mt-1">Update details</p>
        </div>
        <button type="button" onClick={toggleEditCandidate} className="p-2 bg-surface text-on-surface hover:bg-surface-container-high rounded-full transition-colors" aria-label="Close edit form">
          <Icon name="close" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Controller name="name" control={control} render={({ field }) => <Input label="Full Name *" placeholder="Jane Doe" {...field} error={errors.name?.message} />} />
          <Controller name="phone" control={control} render={({ field }) => <Input label="Phone Number *" placeholder="+1 (555) 000-0000" {...field} error={errors.phone?.message} />} />
          <Controller name="gmail" control={control} render={({ field }) => <Input label="Email Address *" placeholder="jane.doe@example.com" type="email" {...field} error={errors.gmail?.message} />} />
          <Controller name="linkCV" control={control} render={({ field }) => <Input label="Resume / Portfolio Link" placeholder="https://..." {...field} error={errors.linkCV?.message} />} />
          <Controller name="gender" control={control} render={({ field }) => <Sel label="Gender" {...field} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} />} />
          <Controller name="level" control={control} render={({ field }) => <Sel label="Seniority Level" {...field} options={[{ value: 'Senior', label: 'Senior' }, { value: 'Beginner', label: 'Beginner' }, { value: 'Newbie', label: 'Newbie' }]} />} />
        </div>

        <div className="mb-8 p-4 sm:p-6 bg-surface-container-low rounded-xl">
          <Controller name="interviewStatus" control={control} render={({ field: { value, onChange } }) => <ConfirmPicker value={value} onChange={onChange} />} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Btn type="submit" className="w-full sm:w-auto justify-center" icon="save">Update Candidate</Btn>
          <Btn type="button" className="w-full sm:w-auto justify-center" variant="tonal" onClick={toggleEditCandidate}>Cancel</Btn>
        </div>
      </form>
    </div>
  );
};
export default EditCandidateForm;
