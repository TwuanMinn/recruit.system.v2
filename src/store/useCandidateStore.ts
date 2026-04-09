import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Candidate, SortConfig, InterviewStatus, Level, ResultValue, ActivityLogEntry, ActivitySnapshot } from '../types';
import { ITEMS_PER_PAGE, STORAGE_KEY } from '../constants';

function logEntry(action: ActivityLogEntry['action'], details?: string, snapshot?: ActivitySnapshot): ActivityLogEntry {
  return { action, timestamp: new Date().toISOString(), details, snapshot };
}

function interviewSnapshot(candidate: Candidate): ActivitySnapshot {
  const iv = candidate.interview;
  return {
    result: iv?.result || undefined,
    interviewStatus: candidate.interviewStatus,
    level: candidate.level,
    yearsExp: iv?.yearsExp || undefined,
    salaryExpectation: iv?.salaryExpectation || undefined,
    salaryType: iv?.salaryType,
    skill: iv?.skill || undefined,
  };
}

export interface CandidateState {
  candidates: Candidate[];
  deletedCandidates: Candidate[];
  selectedIds: string[];
  view: 'list' | 'detail';
  selectedCandidate: Candidate | null;
  showForm: boolean;
  showInterview: boolean;
  showEditCandidate: boolean;
  showTrash: boolean;
  searchTerm: string;
  filterLevel: string;
  filterResult: string;
  sortConfig: SortConfig;
  currentPage: number;
  pageSize: number;

  // Candidate CRUD
  loadCandidates: (candidates: Candidate[]) => void;
  addCandidate: (candidate: Candidate) => void;
  addCandidateComplete: (candidate: Candidate) => void;
  batchAddCandidates: (candidates: Candidate[]) => void;
  updateCandidate: (candidate: Candidate) => void;
  deleteCandidate: (id: string) => void;

  // Soft delete & recovery
  softDeleteCandidate: (id: string) => void;
  restoreCandidate: (id: string) => void;
  permanentlyDeleteCandidate: (id: string) => void;
  emptyTrash: () => void;
  restoreAll: () => void;

  // Bulk selection
  toggleSelectCandidate: (id: string) => void;
  selectAllCandidates: (ids: string[]) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;
  bulkSoftDelete: () => void;
  bulkUpdateStatus: (status: InterviewStatus) => void;
  bulkUpdateLevel: (level: Level) => void;
  bulkUpdateResult: (result: ResultValue) => void;
  bulkUpdateAll: (changes: { status?: InterviewStatus; level?: Level; result?: ResultValue }) => void;

  // Navigation
  selectCandidate: (candidate: Candidate | null) => void;
  setView: (view: 'list' | 'detail') => void;
  toggleForm: () => void;
  toggleInterview: () => void;
  toggleEditCandidate: () => void;
  toggleTrash: () => void;

  // Filtering & sorting
  setSearchTerm: (term: string) => void;
  setFilterLevel: (level: string) => void;
  setFilterResult: (result: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setPage: (page: number) => void;
}

export const useCandidateStore = create<CandidateState>()(
  persist(
    (set) => ({
      candidates: [],
      deletedCandidates: [],
      selectedIds: [],
      view: 'list',
      selectedCandidate: null,
      showForm: false,
      showInterview: false,
      showEditCandidate: false,
      showTrash: false,
      searchTerm: '',
      filterLevel: 'all',
      filterResult: 'all',
      sortConfig: { field: 'name', direction: 'asc' },
      currentPage: 1,
      pageSize: ITEMS_PER_PAGE,

      // ===== CRUD =====
      loadCandidates: (candidates) => set({ candidates }),

      addCandidate: (candidate) =>
        set((state) => ({
          candidates: [...state.candidates, {
            ...candidate,
            activityLog: [
              ...(candidate.activityLog || []),
              logEntry('created', `${candidate.name} added to pipeline`),
            ],
          }],
          showForm: false,
          view: 'detail',
          selectedCandidate: candidate,
          showInterview: true,
        })),

      addCandidateComplete: (candidate) =>
        set((state) => ({
          candidates: [...state.candidates, {
            ...candidate,
            activityLog: [
              ...(candidate.activityLog || []),
              logEntry('created', `${candidate.name} added with full assessment`, interviewSnapshot(candidate)),
            ],
          }],
          showForm: false,
          view: 'detail',
          selectedCandidate: candidate,
          showInterview: false,
        })),

      batchAddCandidates: (newCandidates) =>
        set((state) => ({
          candidates: [
            ...state.candidates,
            ...newCandidates.map((c) => ({
              ...c,
              activityLog: [...(c.activityLog || []), logEntry('created', 'Imported via CSV')],
            })),
          ],
        })),

      updateCandidate: (candidate) =>
        set((state) => {
          const prev = state.candidates.find((c) => c.id === candidate.id);
          const newLogs: ActivityLogEntry[] = [...(candidate.activityLog || [])];

          if (prev) {
            if (prev.interviewStatus !== candidate.interviewStatus) {
              newLogs.push(logEntry('status_changed', `Status → ${candidate.interviewStatus}`));
            }
            if (prev.level !== candidate.level) {
              newLogs.push(logEntry('level_changed', `Level → ${candidate.level}`));
            }
            if (prev.name !== candidate.name || prev.gmail !== candidate.gmail || prev.phone !== candidate.phone) {
              newLogs.push(logEntry('profile_updated', 'Profile details updated'));
            }
            if (!prev.interview && candidate.interview) {
              newLogs.push(logEntry('assessment_recorded', `Assessment recorded — ${candidate.interview.result || 'Pending'}`, interviewSnapshot(candidate)));
            } else if (prev.interview && candidate.interview) {
              if (prev.interview.result !== candidate.interview.result && candidate.interview.result) {
                newLogs.push(logEntry('result_changed', `Result → ${candidate.interview.result}`, interviewSnapshot(candidate)));
              } else {
                newLogs.push(logEntry('assessment_updated', 'Assessment notes updated', interviewSnapshot(candidate)));
              }
            }
          }

          const updated = { ...candidate, activityLog: newLogs };

          return {
            candidates: state.candidates.map((c) => c.id === updated.id ? updated : c),
            showInterview: false,
            showEditCandidate: false,
            selectedCandidate: updated,
          };
        }),

      deleteCandidate: (id) =>
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id),
          selectedCandidate: null,
          view: 'list',
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        })),

      // ===== Soft Delete & Recovery =====
      softDeleteCandidate: (id) =>
        set((state) => {
          const candidate = state.candidates.find((c) => c.id === id);
          if (!candidate) return state;
          const updated = {
            ...candidate,
            activityLog: [...(candidate.activityLog || []), logEntry('deleted', 'Moved to trash')],
          };
          return {
            candidates: state.candidates.filter((c) => c.id !== id),
            deletedCandidates: [...state.deletedCandidates, updated],
            selectedCandidate:
              state.selectedCandidate?.id === id ? null : state.selectedCandidate,
            view: state.selectedCandidate?.id === id ? 'list' : state.view,
            selectedIds: state.selectedIds.filter((sid) => sid !== id),
          };
        }),

      restoreCandidate: (id) =>
        set((state) => {
          const candidate = state.deletedCandidates.find((c) => c.id === id);
          if (!candidate) return state;
          const restored = {
            ...candidate,
            activityLog: [...(candidate.activityLog || []), logEntry('restored', 'Restored from trash')],
          };
          return {
            candidates: [...state.candidates, restored],
            deletedCandidates: state.deletedCandidates.filter((c) => c.id !== id),
          };
        }),

      permanentlyDeleteCandidate: (id) =>
        set((state) => ({
          deletedCandidates: state.deletedCandidates.filter((c) => c.id !== id),
        })),

      emptyTrash: () => set({ deletedCandidates: [] }),

      restoreAll: () =>
        set((state) => {
          const restored = state.deletedCandidates.map((c) => ({
            ...c,
            activityLog: [...(c.activityLog || []), logEntry('restored', 'Restored from trash')],
          }));
          return {
            candidates: [...state.candidates, ...restored],
            deletedCandidates: [],
          };
        }),

      // ===== Bulk Selection =====
      toggleSelectCandidate: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((sid) => sid !== id)
            : [...state.selectedIds, id],
        })),

      selectAllCandidates: (ids) =>
        set((state) => {
          const allSelected = ids.length > 0 && ids.every((id) => state.selectedIds.includes(id));
          return {
            selectedIds: allSelected
              ? state.selectedIds.filter((sid) => !ids.includes(sid))
              : [...new Set([...state.selectedIds, ...ids])],
          };
        }),

      setSelection: (ids) => set({ selectedIds: ids }),

      clearSelection: () => set({ selectedIds: [] }),

      bulkSoftDelete: () =>
        set((state) => {
          const toDelete = state.candidates.filter((c) =>
            state.selectedIds.includes(c.id)
          ).map((c) => ({
            ...c,
            activityLog: [...(c.activityLog || []), logEntry('deleted', 'Bulk deleted — moved to trash')],
          }));
          return {
            candidates: state.candidates.filter(
              (c) => !state.selectedIds.includes(c.id)
            ),
            deletedCandidates: [...state.deletedCandidates, ...toDelete],
            selectedIds: [],
          };
        }),

      bulkUpdateStatus: (status) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            state.selectedIds.includes(c.id)
              ? {
                  ...c,
                  interviewStatus: status,
                  interviewConfirmed: status === 'Confirmed',
                  activityLog: [...(c.activityLog || []), logEntry('status_changed', `Bulk status → ${status}`)],
                }
              : c
          ),
          selectedIds: [],
        })),

      bulkUpdateLevel: (level) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            state.selectedIds.includes(c.id)
              ? {
                  ...c,
                  level,
                  activityLog: [...(c.activityLog || []), logEntry('level_changed', `Bulk level → ${level}`)],
                }
              : c
          ),
          selectedIds: [],
        })),

      bulkUpdateResult: (result) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            state.selectedIds.includes(c.id)
              ? {
                  ...c,
                  interview: c.interview
                    ? { ...c.interview, result }
                    : { result, interviewDate: '', yearsExp: '', salaryExpectation: '', salaryType: 'monthly' as const, skill: '', note: '', strength: '', weakness: '', background: '' },
                  activityLog: [...(c.activityLog || []), logEntry('result_changed', `Bulk result → ${result}`)],
                }
              : c
          ),
          selectedIds: [],
        })),

      bulkUpdateAll: (changes: { status?: InterviewStatus; level?: Level; result?: ResultValue }) =>
        set((state) => ({
          candidates: state.candidates.map((c) => {
            if (!state.selectedIds.includes(c.id)) return c;
            const logs = [...(c.activityLog || [])];
            let updated = { ...c };
            if (changes.status) {
              updated = { ...updated, interviewStatus: changes.status, interviewConfirmed: changes.status === 'Confirmed' };
              logs.push(logEntry('status_changed', `Bulk status → ${changes.status}`));
            }
            if (changes.level) {
              updated = { ...updated, level: changes.level };
              logs.push(logEntry('level_changed', `Bulk level → ${changes.level}`));
            }
            if (changes.result) {
              updated = {
                ...updated,
                interview: updated.interview
                  ? { ...updated.interview, result: changes.result }
                  : { result: changes.result, interviewDate: '', yearsExp: '', salaryExpectation: '', salaryType: 'monthly' as const, skill: '', note: '', strength: '', weakness: '', background: '' },
              };
              logs.push(logEntry('result_changed', `Bulk result → ${changes.result}`));
            }
            return { ...updated, activityLog: logs };
          }),
          selectedIds: [],
        })),

      // ===== Navigation =====
      selectCandidate: (candidate) =>
        set({
          selectedCandidate: candidate,
          view: 'detail',
          showInterview: false,
          showEditCandidate: false,
        }),
      setView: (view) => set({ view }),
      toggleForm: () => set((state) => ({ showForm: !state.showForm })),
      toggleInterview: () =>
        set((state) => ({
          showInterview: !state.showInterview,
          showEditCandidate: false,
        })),
      toggleEditCandidate: () =>
        set((state) => ({
          showEditCandidate: !state.showEditCandidate,
          showInterview: false,
        })),
      toggleTrash: () => set((state) => ({ showTrash: !state.showTrash })),

      // ===== Filtering & Sorting =====
      setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
      setFilterLevel: (level) => set({ filterLevel: level, currentPage: 1 }),
      setFilterResult: (result) => set({ filterResult: result, currentPage: 1 }),
      setSortConfig: (config) => set({ sortConfig: config, currentPage: 1 }),
      setPage: (page) => set({ currentPage: page }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        candidates: state.candidates,
        deletedCandidates: state.deletedCandidates,
      }),
    }
  )
);
