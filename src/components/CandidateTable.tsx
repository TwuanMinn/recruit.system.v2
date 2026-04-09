import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Candidate, Level, SortConfig, SortField } from '../types';
import { StatusDot, Icon, Avatar } from './ui';
import { EmptyStateIllustration } from './EmptyState';
import { useCandidateStore } from '../store/useCandidateStore';
import BulkActionBar from './BulkActionBar';
import TablePagination from './TablePagination';
import MobileCandidateCards from './MobileCandidateCards';

interface Props {
  candidates: Candidate[];
  totalFiltered: number;
  searchTerm: string;
  sortConfig: SortConfig;
  currentPage: number;
  totalPages: number;
  deleteConfirmId: string | null;
  onSearch: (term: string) => void;
  onSort: (field: SortField) => void;
  onSelect: (c: Candidate) => void;
  onDelete: (id: string) => void;
  onDeleteConfirm: (id: string | null) => void;
  onPageChange: (page: number) => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onImportCSV: () => void;
}

const levelBadgeConfig: Record<Level, { color: string; border: string }> = {
  Senior: { color: 'text-primary', border: 'border-primary/10' },
  Beginner: { color: 'text-on-surface-variant', border: 'border-outline-variant/30' },
  Newbie: { color: 'text-tertiary', border: 'border-tertiary/10' },
};

const SortableHeader: React.FC<{
  label: string;
  field: SortField;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  className?: string;
}> = ({ label, field, sortConfig, onSort, className = '' }) => (
  <th
    className={`px-8 py-4 font-bold cursor-pointer select-none hover:text-on-surface/70 transition-colors ${className}`}
    onClick={() => onSort(field)}
    aria-sort={sortConfig.field === field ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
  >
    <span className="inline-flex items-center gap-1">
      {label}
      {sortConfig.field === field && (
        <Icon name={sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'} size="text-[14px]" />
      )}
    </span>
  </th>
);

const CandidateTable: React.FC<Props> = ({
  candidates,
  totalFiltered,
  searchTerm,
  sortConfig,
  currentPage,
  totalPages,
  deleteConfirmId,
  onSearch,
  onSort,
  onSelect,
  onDelete,
  onDeleteConfirm,
  onPageChange,
  onExportPDF,
  onExportCSV,
  onExportExcel,
  onImportCSV,
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const selectedIds = useCandidateStore((s) => s.selectedIds);
  const toggleSelectCandidate = useCandidateStore((s) => s.toggleSelectCandidate);
  const selectAllCandidates = useCandidateStore((s) => s.selectAllCandidates);

  const visibleIds = candidates.map((c) => c.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [exportOpen]);

  return (
    <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden border border-outline-variant/10">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest/50">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-on-surface whitespace-nowrap">
            Recent Candidates
            <span className="text-sm font-medium text-on-surface/40 ml-2">({totalFiltered})</span>
          </h3>
          <div className="flex gap-2 flex-wrap items-center">
            {/* Split Export Button */}
            <div className="relative" ref={exportRef}>
              <div className="flex">
                <button
                  onClick={onExportPDF}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-l-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-red-600/20 border-r border-red-700"
                  aria-label="Export all candidates to PDF"
                >
                  <Icon name="download" size="text-sm" /> Export
                </button>
                <button
                  onClick={() => setExportOpen(o => !o)}
                  className="px-2 py-1.5 bg-red-600 text-white text-xs font-bold rounded-r-lg hover:bg-red-700 transition-colors flex items-center shadow-sm shadow-red-600/20"
                  aria-label="Choose export format"
                >
                  <Icon name="expand_more" size="text-sm" />
                </button>
              </div>
              {exportOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-surface-container rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50">
                  <button onClick={() => { onExportPDF(); setExportOpen(false); }} className="w-full px-4 py-2.5 text-xs font-bold text-left flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                    <Icon name="picture_as_pdf" size="text-sm" className="text-red-500" /> Export PDF
                  </button>
                  <button onClick={() => { onExportCSV(); setExportOpen(false); }} className="w-full px-4 py-2.5 text-xs font-bold text-left flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                    <Icon name="table_view" size="text-sm" className="text-secondary" /> Export CSV
                  </button>
                  <button onClick={() => { onExportExcel(); setExportOpen(false); }} className="w-full px-4 py-2.5 text-xs font-bold text-left flex items-center gap-2 hover:bg-surface-container-high transition-colors">
                    <Icon name="grid_on" size="text-sm" className="text-green-600" /> Export Excel
                  </button>
                </div>
              )}
            </div>

            {/* Import */}
            <button
              onClick={onImportCSV}
              className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-highest/80 transition-colors flex items-center gap-1.5"
              aria-label="Import candidates from CSV file"
            >
              <Icon name="upload" size="text-sm" /> Import
            </button>
          </div>
        </div>
        <div className="relative w-full sm:max-w-md group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Icon name="search" className="text-on-surface/40 group-focus-within:text-primary transition-colors duration-300" />
          </div>
          <input
            id="search-candidates"
            className="w-full pl-12 pr-16 py-3 bg-surface border border-outline-variant/20 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 placeholder:text-on-surface/40 text-sm font-medium outline-none transition-all shadow-sm hover:shadow-md focus:shadow-md"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search candidates by name, email, phone, level, or notes"
          />
          {searchTerm ? (
            <button
              onClick={() => onSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-on-surface/40 hover:text-error transition-colors"
              aria-label="Clear search"
            >
              <Icon name="cancel" size="text-[20px]" />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-surface-container border border-outline-variant/20 text-[0.625rem] font-bold text-on-surface/50 shadow-sm">
                Ctrl K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar />

      {/* Content */}
      <div>
        {candidates.length === 0 ? (
          <EmptyStateIllustration />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left" role="table">
                <thead>
                  <tr className="text-[0.6875rem] uppercase tracking-widest text-on-surface/40 border-b border-outline-variant/5 bg-surface-container-lowest/50">
                    <th className="px-4 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={() => selectAllCandidates(visibleIds)}
                        className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer accent-[rgb(var(--color-primary))]"
                        aria-label="Select all visible candidates"
                      />
                    </th>
                    <SortableHeader label="Candidate" field="name" sortConfig={sortConfig} onSort={onSort} />
                    <SortableHeader label="Level" field="level" sortConfig={sortConfig} onSort={onSort} />
                    <SortableHeader label="Int. Status" field="status" sortConfig={sortConfig} onSort={onSort} />
                    <th className="px-8 py-4 font-bold">Result</th>
                    <th className="px-8 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <AnimatePresence>
                    {candidates.map((c, i) => {
                      const badge = levelBadgeConfig[c.level] || levelBadgeConfig.Beginner;
                      const isConfirmed = c.interviewStatus === 'Confirmed';
                      const isSelected = selectedIds.includes(c.id);

                      return (
                        <motion.tr
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          key={c.id}
                          className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer group ${isSelected ? 'bg-primary/5' : ''}`}
                          onClick={() => onSelect(c)}
                          role="row"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && onSelect(c)}
                        >
                          <td className="px-4 py-5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectCandidate(c.id)}
                              className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer accent-[rgb(var(--color-primary))]"
                              aria-label={`Select ${c.name}`}
                            />
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <Avatar name={c.name} id={c.id} />
                              <div>
                                <div className="font-bold text-on-surface text-sm">{c.name}</div>
                                <div className="text-xs text-on-surface/50">{c.gmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 glass-float rounded-md text-xs font-bold border ${badge.color} ${badge.border}`}>
                              {c.level}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <StatusDot
                              label={c.interviewStatus === 'Rejected' ? 'Denied' : (c.interviewStatus || 'No Response')}
                              color={isConfirmed ? 'var(--status-confirmed)' : c.interviewStatus === 'Rejected' ? 'var(--status-denied)' : 'var(--status-pending)'}
                            />
                          </td>
                          <td className="px-8 py-5">
                            {c.interview?.result ? (
                              <StatusDot
                                label={c.interview.result}
                                color={
                                  c.interview.result === 'Hired' ? 'var(--status-confirmed)'
                                  : c.interview.result === 'Rejected' ? 'var(--status-denied)'
                                  : c.interview.result === 'Potential Talented' ? '#b45309'
                                  : 'var(--status-pending)'
                                }
                              />
                            ) : (
                              <StatusDot label="No Result" color="var(--status-pending)" />
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg transition-colors"
                                title="Preview Profile"
                                aria-label={`View ${c.name}'s profile`}
                                onClick={(e) => { e.stopPropagation(); onSelect(c); }}
                              >
                                <Icon name="visibility" size="text-[20px]" />
                              </button>
                              {deleteConfirmId === c.id ? (
                                <div className="flex items-center bg-error/10 text-error rounded-lg overflow-hidden animate-fade-in" role="alert">
                                  <button
                                    className="px-3 py-2 text-xs font-bold hover:bg-error/20 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                                    aria-label={`Confirm delete ${c.name}`}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    className="px-2 py-2 hover:bg-error/20 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); onDeleteConfirm(null); }}
                                    aria-label="Cancel delete"
                                  >
                                    <Icon name="close" size="text-[16px]" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-lg transition-colors"
                                  title="Delete Candidate"
                                  aria-label={`Delete ${c.name}`}
                                  onClick={(e) => { e.stopPropagation(); onDeleteConfirm(c.id); }}
                                >
                                  <Icon name="delete" size="text-[20px]" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <MobileCandidateCards
              candidates={candidates}
              deleteConfirmId={deleteConfirmId}
              onSelect={onSelect}
              onDelete={onDelete}
              onDeleteConfirm={onDeleteConfirm}
            />

            {/* Pagination */}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalFiltered={totalFiltered}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateTable;
