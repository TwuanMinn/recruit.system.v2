import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InterviewStatus, Level, ResultValue } from '../types';
import { useCandidateStore } from '../store/useCandidateStore';
import { useFilteredCandidates } from '../hooks/useFilteredCandidates';
import { Icon } from './ui';

const STATUSES: InterviewStatus[] = ['Confirmed', 'Rejected', 'No Response'];
const LEVELS: Level[] = ['Senior', 'Beginner', 'Newbie'];
const RESULTS: ResultValue[] = ['Hired', 'Potential Talented', 'Rejected', 'Future Consideration'];

const STATUS_LABEL: Record<InterviewStatus, string> = {
  Confirmed: 'Confirmed',
  Rejected: 'Denied',
  'No Response': 'No Response',
};

const BulkActionBar: React.FC = () => {
  const [bulkBarSettled, setBulkBarSettled] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [pickedStatus, setPickedStatus] = useState<InterviewStatus | null>(null);
  const [pickedLevel, setPickedLevel] = useState<Level | null>(null);
  const [pickedResult, setPickedResult] = useState<ResultValue | null>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const selectedIds = useCandidateStore((s) => s.selectedIds);
  const clearSelection = useCandidateStore((s) => s.clearSelection);
  const bulkSoftDelete = useCandidateStore((s) => s.bulkSoftDelete);
  const bulkUpdateAll = useCandidateStore((s) => s.bulkUpdateAll);
  const setSelection = useCandidateStore((s) => s.setSelection);

  const { sorted } = useFilteredCandidates();
  const total = sorted.length;

  const someSelected = selectedIds.length > 0;
  const hasChanges = pickedStatus || pickedLevel || pickedResult;

  function handleSlider(val: number) {
    if (val === 0) {
      clearSelection();
    } else {
      setSelection(sorted.slice(0, val).map((c) => c.id));
    }
  }

  function openPanel() {
    const rect = editBtnRef.current?.getBoundingClientRect();
    if (rect) setPanelPos({ top: rect.bottom + 8, left: rect.left });
    setPickedStatus(null);
    setPickedLevel(null);
    setPickedResult(null);
    setPanelOpen(true);
  }

  function applyChanges() {
    if (!hasChanges) return;
    bulkUpdateAll({
      status: pickedStatus ?? undefined,
      level: pickedLevel ?? undefined,
      result: pickedResult ?? undefined,
    });
    setPanelOpen(false);
  }

  if (total === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={bulkBarSettled ? 'overflow-visible' : 'overflow-hidden'}
        onAnimationComplete={(def) => setBulkBarSettled(def === 'animate')}
        onAnimationStart={() => setBulkBarSettled(false)}
      >
        <div className="px-4 sm:px-8 py-3 bg-primary/5 border-b border-primary/10">
          {/* Slider row */}
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-xs font-bold text-primary shrink-0 w-24 tabular-nums">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : 'Select candidates'}
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={total}
                value={selectedIds.length}
                onChange={(e) => handleSlider(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[rgb(var(--color-primary))]"
                style={{
                  background: `linear-gradient(to right, rgb(var(--color-primary)) ${(selectedIds.length / total) * 100}%, rgb(var(--color-surface-container)) ${(selectedIds.length / total) * 100}%)`,
                }}
                aria-label="Select number of candidates"
              />
            </div>
            <span className="text-xs font-bold text-on-surface/30 shrink-0 tabular-nums w-8 text-right">
              {total}
            </span>
          </div>

          {/* Action buttons — only when selection active */}
          <AnimatePresence>
            {someSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 flex-wrap pt-1"
              >
                <button
                  ref={editBtnRef}
                  onClick={openPanel}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="tune" size="text-sm" /> Edit Selected
                </button>
                <button
                  onClick={bulkSoftDelete}
                  className="px-3 py-1.5 bg-error/10 text-error text-xs font-bold rounded-lg hover:bg-error/20 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="delete" size="text-sm" /> Delete
                </button>
                <button
                  onClick={() => clearSelection()}
                  className="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Unified edit panel */}
        <AnimatePresence>
          {panelOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -4 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 p-5 w-[340px]"
                style={{ top: panelPos.top, left: Math.min(panelPos.left, window.innerWidth - 360) }}
              >
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface/40 mb-4">
                  Bulk Edit — {selectedIds.length} candidates
                </div>

                {/* Status */}
                <div className="mb-4">
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface/40 mb-2 flex items-center gap-1.5">
                    <Icon name="swap_horiz" size="text-xs" /> Interview Status
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPickedStatus(pickedStatus === s ? null : s)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          pickedStatus === s
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className="mb-4">
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface/40 mb-2 flex items-center gap-1.5">
                    <Icon name="military_tech" size="text-xs" /> Level
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setPickedLevel(pickedLevel === l ? null : l)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          pickedLevel === l
                            ? 'bg-tertiary text-on-tertiary'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result */}
                <div className="mb-5">
                  <div className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface/40 mb-2 flex items-center gap-1.5">
                    <Icon name="verified" size="text-xs" /> Result
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {RESULTS.map((r) => (
                      <button
                        key={r}
                        onClick={() => setPickedResult(pickedResult === r ? null : r)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          pickedResult === r
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/15">
                  <button
                    onClick={applyChanges}
                    disabled={!hasChanges}
                    className="flex-1 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-dim active:scale-[0.98] transition-all"
                  >
                    Apply to {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''}
                  </button>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="px-4 py-2 bg-surface-container text-on-surface-variant text-xs font-bold rounded-xl hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkActionBar;
