import React from 'react';
import type { ActivityLogEntry } from '../types';
import { Icon } from './ui';
import { formatRelativeTime } from '../utils/formatDate';

interface Props {
  activityLog: ActivityLogEntry[];
}

const actionConfig: Record<string, { icon: string; color: string; label: string }> = {
  created: { icon: 'person_add', color: 'text-primary', label: 'Created' },
  status_changed: { icon: 'swap_horiz', color: 'text-tertiary', label: 'Status Changed' },
  level_changed: { icon: 'military_tech', color: 'text-tertiary', label: 'Level Changed' },
  profile_updated: { icon: 'edit', color: 'text-on-surface-variant', label: 'Profile Updated' },
  assessment_recorded: { icon: 'rate_review', color: 'text-secondary', label: 'Assessment Recorded' },
  assessment_updated: { icon: 'edit_note', color: 'text-secondary', label: 'Assessment Updated' },
  result_changed: { icon: 'verified', color: 'text-primary', label: 'Result Changed' },
  deleted: { icon: 'delete', color: 'text-error', label: 'Deleted' },
  restored: { icon: 'restore', color: 'text-secondary', label: 'Restored' },
};

const ActivityTimeline: React.FC<Props> = ({ activityLog }) => {
  if (!activityLog || activityLog.length === 0) {
    return (
      <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl card-shadow border border-outline-variant/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface/40 mb-4">Activity Timeline</h3>
        <div className="text-center py-6">
          <Icon name="timeline" size="text-3xl" className="text-on-surface/15 mb-2" />
          <p className="text-sm text-on-surface/40">No activity recorded yet.</p>
        </div>
      </div>
    );
  }

  const sortedLog = [...activityLog].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl card-shadow border border-outline-variant/10">
      <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface/40 mb-5">
        Activity Timeline
        <span className="ml-2 text-on-surface/25 normal-case tracking-normal">({sortedLog.length})</span>
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline-variant/15" />

        <div className="space-y-1">
          {sortedLog.map((entry, i) => {
            const config = actionConfig[entry.action] || {
              icon: 'info',
              color: 'text-on-surface-variant',
              label: entry.action,
            };

            return (
              <div key={`${entry.timestamp}-${i}`} className="relative flex items-start gap-3 py-2.5 group">
                {/* Dot */}
                <div
                  className={`relative z-10 w-[30px] h-[30px] shrink-0 rounded-lg flex items-center justify-center bg-surface transition-colors ${config.color}`}
                  style={{ border: '2px solid rgb(var(--color-outline-variant) / 0.15)' }}
                >
                  <Icon name={config.icon} size="text-[14px]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-bold text-on-surface">
                      {config.label}
                    </span>
                    <span className="text-[0.625rem] text-on-surface/35 font-medium shrink-0 tabular-nums">
                      {formatRelativeTime(entry.timestamp)}
                    </span>
                  </div>
                  {entry.details && (
                    <p className="text-xs text-on-surface/50 mt-0.5 leading-relaxed">
                      {entry.details}
                    </p>
                  )}
                  {entry.snapshot && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {entry.snapshot.result && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-[10px]">verified</span>
                          {entry.snapshot.result}
                        </span>
                      )}
                      {entry.snapshot.interviewStatus && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                          <span className="material-symbols-outlined text-[10px]">event_available</span>
                          {entry.snapshot.interviewStatus}
                        </span>
                      )}
                      {entry.snapshot.level && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">
                          <span className="material-symbols-outlined text-[10px]">military_tech</span>
                          {entry.snapshot.level}
                        </span>
                      )}
                      {entry.snapshot.yearsExp && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface/60">
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {entry.snapshot.yearsExp} yrs exp
                        </span>
                      )}
                      {entry.snapshot.salaryExpectation && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface/60">
                          <span className="material-symbols-outlined text-[10px]">payments</span>
                          ${Number(entry.snapshot.salaryExpectation).toLocaleString('en-US')}
                          {entry.snapshot.salaryType === 'monthly' ? '/mo' : '/yr'}
                        </span>
                      )}
                      {entry.snapshot.skill && (
                        <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface/60">
                          <span className="material-symbols-outlined text-[10px]">code</span>
                          {entry.snapshot.skill}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
