import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidateStore } from '../store/useCandidateStore';
import { Icon, Avatar } from './ui';
import { formatRelativeTime } from '../utils/formatDate';

const TrashPanel: React.FC = () => {
  const showTrash = useCandidateStore((s) => s.showTrash);
  const toggleTrash = useCandidateStore((s) => s.toggleTrash);
  const deletedCandidates = useCandidateStore((s) => s.deletedCandidates);
  const restoreCandidate = useCandidateStore((s) => s.restoreCandidate);
  const permanentlyDeleteCandidate = useCandidateStore((s) => s.permanentlyDeleteCandidate);
  const emptyTrash = useCandidateStore((s) => s.emptyTrash);
  const restoreAll = useCandidateStore((s) => s.restoreAll);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = deletedCandidates.map((c) => c.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }, [allSelected, allIds]);

  const handleRestoreSelected = useCallback(() => {
    selectedIds.forEach((id) => restoreCandidate(id));
    setSelectedIds(new Set());
  }, [selectedIds, restoreCandidate]);

  const handleDeleteSelected = useCallback(() => {
    selectedIds.forEach((id) => permanentlyDeleteCandidate(id));
    setSelectedIds(new Set());
  }, [selectedIds, permanentlyDeleteCandidate]);

  const handleRestoreAll = useCallback(() => {
    restoreAll();
    setSelectedIds(new Set());
  }, [restoreAll]);

  const handleEmptyTrash = useCallback(() => {
    emptyTrash();
    setSelectedIds(new Set());
  }, [emptyTrash]);

  if (!showTrash) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="trash-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={toggleTrash}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'backOut' }}
          className="bg-surface-container-lowest w-full max-w-2xl max-h-[80vh] rounded-2xl card-shadow-lg border border-outline-variant/10 overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
                <Icon name="delete_sweep" className="text-error" size="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">Trash</h2>
                <p className="text-xs text-on-surface/50">
                  {deletedCandidates.length} deleted candidate{deletedCandidates.length !== 1 ? 's' : ''}
                  {someSelected && (
                    <span className="text-primary font-bold ml-1">
                      • {selectedIds.size} selected
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {deletedCandidates.length > 0 && (
                <>
                  <button
                    onClick={handleRestoreAll}
                    className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="restore" size="text-sm" /> Restore All
                  </button>
                  <button
                    onClick={handleEmptyTrash}
                    className="px-3 py-1.5 bg-error/10 text-error text-xs font-bold rounded-lg hover:bg-error/20 transition-colors flex items-center gap-1.5"
                  >
                    <Icon name="delete_forever" size="text-sm" /> Empty Trash
                  </button>
                </>
              )}
              <button
                onClick={toggleTrash}
                className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors"
                aria-label="Close trash"
              >
                <Icon name="close" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {deletedCandidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-20 h-20 bg-surface-container rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="check_circle" size="text-4xl" className="text-secondary/40" />
                </div>
                <h3 className="text-base font-bold text-on-surface/60 mb-1">Trash is empty</h3>
                <p className="text-sm text-on-surface/40 text-center">
                  Deleted candidates will appear here for recovery.
                </p>
              </div>
            ) : (
              <>
                {/* Select All Row */}
                <div className="px-6 py-3 border-b border-outline-variant/5 flex items-center gap-3 bg-surface-container-lowest/80 sticky top-0 z-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer accent-[rgb(var(--color-primary))]"
                    aria-label="Select all deleted candidates"
                  />
                  <span className="text-xs font-bold text-on-surface/50">
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </span>
                </div>

                {/* Candidate List */}
                <div className="divide-y divide-outline-variant/5">
                  {deletedCandidates.map((c) => {
                    const deletedEntry = [...(c.activityLog || [])].reverse().find((e) => e.action === 'deleted');
                    const deletedAt = deletedEntry?.timestamp;
                    const isSelected = selectedIds.has(c.id);

                    return (
                      <div
                        key={c.id}
                        className={`px-6 py-4 flex items-center gap-4 hover:bg-surface-container-low/30 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                        onClick={() => toggleSelect(c.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(c.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer accent-[rgb(var(--color-primary))] shrink-0"
                          aria-label={`Select ${c.name}`}
                        />
                        <Avatar name={c.name} id={c.id} />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-on-surface text-sm truncate">{c.name}</div>
                          <div className="text-xs text-on-surface/50 truncate">{c.gmail}</div>
                          {deletedAt && (
                            <div className="text-[0.625rem] text-on-surface/35 mt-0.5">
                              Deleted {formatRelativeTime(deletedAt)}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Floating Selection Action Bar */}
          <AnimatePresence>
            {someSelected && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'backOut' }}
                className="border-t border-outline-variant/10 px-6 py-4 bg-surface-container-low/80 backdrop-blur-sm flex items-center justify-between gap-3"
              >
                <span className="text-sm font-bold text-on-surface/70">
                  {selectedIds.size} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-3 py-2 text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestoreSelected}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary/60 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm shadow-primary/20"
                  >
                    <Icon name="restore" size="text-sm" /> Restore ({selectedIds.size})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-gradient-to-r from-primary/70 to-white/90 text-primary text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 border border-primary/15"
                  >
                    <Icon name="delete_forever" size="text-sm" /> Delete ({selectedIds.size})
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrashPanel;
