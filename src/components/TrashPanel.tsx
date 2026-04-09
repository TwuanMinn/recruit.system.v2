import React from 'react';
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
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {deletedCandidates.length > 0 && (
                <button
                  onClick={emptyTrash}
                  className="px-3 py-1.5 bg-error/10 text-error text-xs font-bold rounded-lg hover:bg-error/20 transition-colors flex items-center gap-1.5"
                >
                  <Icon name="delete_forever" size="text-sm" /> Empty Trash
                </button>
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
              <div className="divide-y divide-outline-variant/5">
                {deletedCandidates.map((c) => {
                  const deletedEntry = [...(c.activityLog || [])].reverse().find((e) => e.action === 'deleted');
                  const deletedAt = deletedEntry?.timestamp;

                  return (
                    <div
                      key={c.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-surface-container-low/30 transition-colors"
                    >
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
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => restoreCandidate(c.id)}
                          className="px-3 py-1.5 bg-secondary/10 text-secondary text-xs font-bold rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-1.5"
                          aria-label={`Restore ${c.name}`}
                        >
                          <Icon name="restore" size="text-sm" /> Restore
                        </button>
                        <button
                          onClick={() => permanentlyDeleteCandidate(c.id)}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          aria-label={`Permanently delete ${c.name}`}
                          title="Delete permanently"
                        >
                          <Icon name="delete_forever" size="text-[18px]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrashPanel;
