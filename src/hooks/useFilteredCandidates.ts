import { useMemo } from 'react';
import { useCandidateStore } from '../store/useCandidateStore';
import { useDebounce } from './useDebounce';
import type { Candidate, SortField } from '../types';

export interface SearchFilter {
  key: string;
  value: string;
  raw: string;
}

export interface FilteredCandidatesResult {
  filtered: Candidate[];
  sorted: Candidate[];
  paginated: Candidate[];
  totalPages: number;
  handleSort: (field: SortField) => void;
  activeFilters: SearchFilter[];
  freeText: string;
}

const SEARCH_PREFIXES: Record<string, (c: Candidate, val: string) => boolean> = {
  level: (c, v) => c.level.toLowerCase() === v,
  status: (c, v) => {
    const s = c.interviewStatus.toLowerCase();
    if (v === 'denied') return s === 'rejected';
    return s === v || s.replace(/\s/g, '') === v.replace(/\s/g, '');
  },
  result: (c, v) => {
    const r = (c.interview?.result || '').toLowerCase();
    if (v === 'potential') return r === 'potential talented';
    if (v === 'future') return r === 'future consideration';
    return r === v || r.includes(v);
  },
  gender: (c, v) => c.gender.toLowerCase() === v,
  salary: (c, v) => {
    const salary = Number(c.interview?.salaryExpectation);
    if (isNaN(salary)) return false;
    if (v.startsWith('>')) return salary > Number(v.slice(1));
    if (v.startsWith('<')) return salary < Number(v.slice(1));
    if (v.startsWith('>=')) return salary >= Number(v.slice(2));
    if (v.startsWith('<=')) return salary <= Number(v.slice(2));
    return salary === Number(v);
  },
  skill: (c, v) => (c.interview?.skill || '').toLowerCase().includes(v),
  exp: (c, v) => {
    const exp = Number(c.interview?.yearsExp);
    if (isNaN(exp)) return false;
    if (v.startsWith('>')) return exp > Number(v.slice(1));
    if (v.startsWith('<')) return exp < Number(v.slice(1));
    return exp === Number(v);
  },
  name: (c, v) => c.name.toLowerCase().includes(v),
};

function parseSearchTerm(raw: string): { filters: SearchFilter[]; freeText: string } {
  const filters: SearchFilter[] = [];
  const freeTextParts: string[] = [];

  // Match patterns like key:value or key:>value or key:"multi word"
  const regex = /(\w+):(?:"([^"]+)"|(\S+))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw)) !== null) {
    // Capture any free text before this match
    const before = raw.slice(lastIndex, match.index).trim();
    if (before) freeTextParts.push(before);

    const key = match[1].toLowerCase();
    const value = (match[2] || match[3]).toLowerCase();

    if (key in SEARCH_PREFIXES) {
      filters.push({ key, value, raw: match[0] });
    } else {
      // Unknown prefix — treat as free text
      freeTextParts.push(match[0]);
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text after last match
  const remaining = raw.slice(lastIndex).trim();
  if (remaining) freeTextParts.push(remaining);

  return { filters, freeText: freeTextParts.join(' ') };
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

  const { filters: activeFilters, freeText } = useMemo(
    () => parseSearchTerm(debouncedSearch),
    [debouncedSearch]
  );

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      // 1. Smart prefix filters
      for (const f of activeFilters) {
        const matcher = SEARCH_PREFIXES[f.key];
        if (matcher && !matcher(c, f.value)) return false;
      }

      // 2. Free text search (remaining text after prefix extraction)
      const term = freeText.toLowerCase();
      const matchFreeText =
        !term ||
        c.name.toLowerCase().includes(term) ||
        c.gmail.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.level.toLowerCase().includes(term) ||
        (c.interview?.result?.toLowerCase().includes(term) ?? false) ||
        (c.interview?.skill?.toLowerCase().includes(term) ?? false) ||
        (c.interview?.note?.toLowerCase().includes(term) ?? false);

      // 3. Dropdown filters (coexist with smart search)
      const matchLevel = filterLevel === 'all' || c.level === filterLevel;
      const matchResult =
        filterResult === 'all' ||
        (filterResult === 'Confirmed'
          ? c.interviewStatus === 'Confirmed'
          : filterResult === 'No Response'
            ? c.interviewStatus === 'No Response'
            : c.interview?.result === filterResult);

      return matchFreeText && matchLevel && matchResult;
    });
  }, [candidates, activeFilters, freeText, filterLevel, filterResult]);

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

  return { filtered, sorted, paginated, totalPages, handleSort, activeFilters, freeText };
}
