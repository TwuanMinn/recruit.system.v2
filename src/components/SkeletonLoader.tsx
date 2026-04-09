import React from 'react';

interface Props {
  type: 'stats' | 'table' | 'sidebar';
}

const SkeletonLoader: React.FC<Props> = ({ type }) => {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8" aria-busy="true" aria-label="Loading statistics">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-5 sm:p-6 rounded-xl card-shadow border border-outline-variant/10">
            <div className="skeleton w-12 h-12 rounded-xl mb-4" />
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="skeleton h-9 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden border border-outline-variant/10" aria-busy="true" aria-label="Loading table">
        <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-10 w-64 rounded-xl" />
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-5">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-36 mb-2" />
                <div className="skeleton h-3 w-48" />
              </div>
              <div className="skeleton h-6 w-20 rounded-md" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading sidebar">
      <div className="bg-surface-container-lowest p-8 rounded-xl card-shadow border border-outline-variant/10">
        <div className="skeleton h-4 w-32 mb-6" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-3 w-12" />
            </div>
            <div className="skeleton h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="bg-surface-container-lowest p-8 rounded-xl card-shadow border border-outline-variant/10">
        <div className="skeleton h-4 w-36 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 text-center">
              <div className="skeleton h-7 w-10 mx-auto mb-2" />
              <div className="skeleton h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
