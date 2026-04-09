import React from 'react';
import type { Candidate, Level } from '../types';
import { StatusDot, Avatar, Icon } from './ui';
import { useCandidateStore } from '../store/useCandidateStore';

interface Props {
  candidates: Candidate[];
  deleteConfirmId: string | null;
  onSelect: (c: Candidate) => void;
  onDelete: (id: string) => void;
  onDeleteConfirm: (id: string | null) => void;
}

const levelBadgeConfig: Record<Level, { color: string; border: string }> = {
  Senior: { color: 'text-primary', border: 'border-primary/10' },
  Beginner: { color: 'text-on-surface-variant', border: 'border-outline-variant/30' },
  Newbie: { color: 'text-tertiary', border: 'border-tertiary/10' },
};

const MobileCandidateCards: React.FC<Props> = ({
  candidates,
  deleteConfirmId,
  onSelect,
  onDelete,
  onDeleteConfirm,
}) => {
  const selectedIds = useCandidateStore((s) => s.selectedIds);
  const toggleSelectCandidate = useCandidateStore((s) => s.toggleSelectCandidate);

  return (
    <div className="sm:hidden divide-y divide-outline-variant/5">
      {candidates.map((c) => {
        const badge = levelBadgeConfig[c.level] || levelBadgeConfig.Beginner;
        const isConfirmed = c.interviewStatus === 'Confirmed';
        const isSelected = selectedIds.includes(c.id);

        return (
          <div
            key={c.id}
            className={`p-4 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
            onClick={() => onSelect(c)}
          >
            <div className="flex items-start gap-3">
              <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectCandidate(c.id)}
                  className="w-4 h-4 rounded border-outline-variant/30 text-primary cursor-pointer accent-[rgb(var(--color-primary))]"
                  aria-label={`Select ${c.name}`}
                />
              </div>

              <Avatar name={c.name} id={c.id} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-on-surface text-sm truncate">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[0.625rem] font-bold border shrink-0 ${badge.color} ${badge.border}`}>
                    {c.level}
                  </span>
                </div>
                <div className="text-xs text-on-surface/50 truncate mb-2">{c.gmail}</div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <StatusDot
                      label={c.interviewStatus === 'Rejected' ? 'Denied' : (c.interviewStatus || 'No Response')}
                      color={isConfirmed ? 'var(--status-confirmed)' : c.interviewStatus === 'Rejected' ? 'var(--status-denied)' : 'var(--status-pending)'}
                    />
                    {c.interview?.result && (
                      <span className="text-[0.625rem] font-bold px-2 py-0.5 rounded-full bg-surface-container">
                        {c.interview.result}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                      aria-label={`View ${c.name}'s profile`}
                      onClick={() => onSelect(c)}
                    >
                      <Icon name="visibility" size="text-[18px]" />
                    </button>
                    <button
                      className="p-1.5 text-on-surface-variant hover:text-error rounded-lg transition-colors"
                      aria-label={`Delete ${c.name}`}
                      onClick={() => onDeleteConfirm(c.id)}
                    >
                      <Icon name="delete" size="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {deleteConfirmId === c.id && (
              <div className="mt-2 ml-14 flex items-center gap-2 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <button
                  className="px-3 py-1.5 bg-error text-on-error text-xs font-bold rounded-lg"
                  onClick={() => onDelete(c.id)}
                >
                  Confirm Delete
                </button>
                <button
                  className="px-3 py-1.5 bg-surface-container text-on-surface text-xs font-bold rounded-lg"
                  onClick={() => onDeleteConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileCandidateCards;
