import React from 'react';
import { Icon } from './ui';
import { useCandidateStore } from '../store/useCandidateStore';

interface Props {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filterLevel: string;
  filterResult: string;
  dispatch?: (action: { type: string; payload: string }) => void;
}

const FilterDropdown: React.FC<Props> = ({ filterOpen, setFilterOpen, filterLevel, filterResult, dispatch }) => {
  const setFilterLevel = useCandidateStore((s) => s.setFilterLevel);
  const setFilterResult = useCandidateStore((s) => s.setFilterResult);
  const hasActiveFilters = filterLevel !== 'all' || filterResult !== 'all';

  const handleLevel = (val: string) => {
    if (dispatch) dispatch({ type: 'SET_FILTER_LEVEL', payload: val });
    else setFilterLevel(val);
  };

  const handleResult = (val: string) => {
    if (dispatch) dispatch({ type: 'SET_FILTER_RESULT', payload: val });
    else setFilterResult(val);
  };

  return (
    <div className="relative flex-1 sm:flex-none">
      <button
        className={`w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 font-bold text-sm rounded-xl active:scale-95 transition-all flex items-center gap-2 ${
          filterOpen || hasActiveFilters
            ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
            : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-highest/80'
        }`}
        onClick={() => setFilterOpen(!filterOpen)}
        aria-expanded={filterOpen}
        aria-haspopup="true"
        aria-label="Filter candidates"
      >
        <Icon name="filter_list" size="text-lg" /> Filter
        {hasActiveFilters && (
          <span className="bg-on-primary text-primary text-[0.625rem] w-4 h-4 flex items-center justify-center rounded-full ml-1" aria-label="Active filters">!</span>
        )}
      </button>

      {filterOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} aria-hidden="true" />
          <div
            className="absolute left-0 sm:left-auto right-0 mt-2 w-full sm:w-56 bg-surface-container-lowest border border-outline-variant/10 shadow-xl rounded-2xl p-5 z-50 animate-fade-in card-shadow text-left"
            role="menu"
            aria-label="Filter options"
          >
            <div className="mb-4">
              <label htmlFor="filter-level" className="block text-[0.625rem] font-bold tracking-[0.05em] text-on-surface/50 uppercase mb-2">
                Seniority Level
              </label>
              <select
                id="filter-level"
                className="w-full px-3 py-2 bg-surface text-sm font-bold text-on-surface rounded-xl border border-outline-variant/20 outline-none cursor-pointer focus:ring-2 focus:border-primary/50 focus:ring-primary/20"
                value={filterLevel}
                onChange={(e) => handleLevel(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="Senior">Senior</option>
                <option value="Beginner">Beginner</option>
                <option value="Newbie">Newbie</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="filter-result" className="block text-[0.625rem] font-bold tracking-[0.05em] text-on-surface/50 uppercase mb-2">
                Application Status
              </label>
              <select
                id="filter-result"
                className="w-full px-3 py-2 bg-surface text-sm font-bold text-on-surface rounded-xl border border-outline-variant/20 outline-none cursor-pointer focus:ring-2 focus:border-primary/50 focus:ring-primary/20"
                value={filterResult}
                onChange={(e) => handleResult(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="No Response">No Response</option>
                <option value="Hired">Hired (Assessed)</option>
                <option value="Rejected">Rejected</option>
                <option value="Potential Talented">Potential</option>
                <option value="Future Consideration">Future Consideration</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button
                className="w-full px-3 py-2 text-xs font-bold text-error hover:bg-error/10 rounded-xl transition-colors"
                onClick={() => {
                  handleLevel('all');
                  handleResult('all');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;
