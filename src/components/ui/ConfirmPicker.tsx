import React from 'react';
import type { InterviewStatus } from '../../types';
import { Icon } from './Icon';

interface ConfirmPickerProps {
  value: InterviewStatus;
  onChange: (v: InterviewStatus) => void;
}

const statusOptions: InterviewStatus[] = ['Confirmed', 'Rejected', 'No Response'];
const statusConfig: Record<InterviewStatus, { icon: string; color: string; bg: string }> = {
  Confirmed: { icon: 'check_circle', color: 'var(--status-confirmed)', bg: 'bg-secondary-container/30' },
  Rejected: { icon: 'cancel', color: 'var(--status-denied)', bg: 'bg-error-container/30' },
  'No Response': { icon: 'schedule', color: 'var(--status-pending)', bg: 'bg-surface-container' },
};

export const ConfirmPicker: React.FC<ConfirmPickerProps> = ({ value, onChange }) => (
  <div className="mb-4" role="radiogroup" aria-label="Interview Status">
    <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/50 mb-2">
      Interview Status
    </label>
    <div className="flex gap-3">
      {statusOptions.map((opt) => {
        const cfg = statusConfig[opt];
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt)}
            className={`flex-1 py-3 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 text-sm font-bold active:scale-95 ${
              selected
                ? `${cfg.bg} border-2 ring-2 ring-offset-1`
                : 'bg-surface-container-lowest border-2 border-outline-variant/10 text-on-surface/40 hover:text-on-surface/70'
            }`}
            style={selected ? { color: cfg.color, borderColor: cfg.color } : undefined}
          >
            <Icon name={cfg.icon} className="text-lg" />
            {opt === 'Rejected' ? 'Denied' : opt}
          </button>
        );
      })}
    </div>
  </div>
);
