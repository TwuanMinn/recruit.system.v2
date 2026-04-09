import React from 'react';
import { Icon } from './ui';

interface Props {
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  onPageChange: (page: number) => void;
}

const TablePagination: React.FC<Props> = ({ currentPage, totalPages, totalFiltered, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-t border-outline-variant/5">
      <span className="text-xs font-bold text-on-surface/40">
        Page {currentPage} of {totalPages} • {totalFiltered} results
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <Icon name="chevron_left" size="text-lg" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let page: number;
          if (totalPages <= 5) {
            page = i + 1;
          } else if (currentPage <= 3) {
            page = i + 1;
          } else if (currentPage >= totalPages - 2) {
            page = totalPages - 4 + i;
          } else {
            page = currentPage - 2 + i;
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                page === currentPage
                  ? 'bg-primary text-on-primary'
                  : 'hover:bg-surface-container text-on-surface/60'
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <Icon name="chevron_right" size="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
