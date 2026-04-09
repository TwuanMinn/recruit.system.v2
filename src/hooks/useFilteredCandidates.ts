import { useMemo } from 'react';
import { useCandidateStore } from '../store/useCandidateStore';
import { useDebounce } from './useDebounce';
import type { Candidate, SortField } from '../types';

export interface FilteredCandidatesResult {
  filtered: Candidate[];
  sorted: Candidate[];
  paginated: Candidate[];
  totalPages: number;
  handleSort: (field: SortField) => void;
}

export function useFilteredCandidates(): FilteredCandidatesResult {
  const candidates = useCandidateStore((s) => s.candidates);
  const searchTerm = useCandidateStore((s) => s.searchTerm);
  const filterLevel = useCandidateStore((s) => s.filterLevel);
  const filterResult = useCandidateStore((s) => s.filterResult);
  const sortConfig = useCandidateStore((s) => s.sortConfig);
  const currentPage = useCandidateStore((s) => s.currentPage);
  const pageSize = useCandidateStore((s) => s.pageSize);
  const setSortConfig = useCandidateStore((s) => s.setSortConfig);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const term = debouncedSearch.toLowerCase();
      const matchSearch =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.gmail.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.level.toLowerCase().includes(term) ||
        (c.interview?.result?.toLowerCase().includes(term) ?? false) ||
        (c.interview?.skill?.toLowerCase().includes(term) ?? false) ||
        (c.interview?.note?.toLowerCase().includes(term) ?? false);
      const matchLevel = filterLevel === 'all' || c.level === filterLevel;
      const matchResult =
        filterResult === 'all' ||
        (filterResult === 'Confirmed'
          ? c.interviewStatus === 'Confirmed'
          : filterResult === 'No Response'
            ? c.interviewStatus === 'No Response'
            : c.interview?.result === filterResult);
      return matchSearch && matchLevel && matchResult;
    });
  }, [candidates, debouncedSearch, filterLevel, filterResult]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const { field, direction } = sortConfig;
      const m = direction === 'asc' ? 1 : -1;
      switch (field) {
        case 'name':
          return a.name.localeCompare(b.name) * m;
        case 'level':
          return a.level.localeCompare(b.level) * m;
        case 'status':
          return a.interviewStatus.localeCompare(b.interviewStatus) * m;
        case 'createdAt':
          return a.createdAt.localeCompare(b.createdAt) * m;
        default:
          return 0;
      }
    });
  }, [filtered, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(
    () => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sorted, currentPage, pageSize]
  );

  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return { filtered, sorted, paginated, totalPages, handleSort };
}
