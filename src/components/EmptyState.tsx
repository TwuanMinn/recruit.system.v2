import React from 'react';

/**
 * Empty state illustration for tables with no results.
 * Inline SVG ensures crisp rendering at any resolution and follows the design system.
 */
export const EmptyStateIllustration: React.FC<{ message?: string; submessage?: string }> = ({
  message = 'No candidates found',
  submessage = 'Try adjusting your search or filters',
}) => (
  <div className="text-center py-16 px-4">
    <div className="mx-auto mb-6 w-48 h-48 relative opacity-90 dark:opacity-100 drop-shadow-none dark:drop-shadow-md transition-all duration-300 hover:scale-105">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Background circle */}
        <circle cx="100" cy="100" r="90" className="fill-surface-container" opacity="0.5" />
        <circle cx="100" cy="100" r="70" className="fill-surface-container-high" opacity="0.4" />

        {/* Document stack */}
        <rect x="55" y="55" width="70" height="90" rx="8" className="fill-surface-container-highest" stroke="rgb(var(--color-outline-variant))" strokeWidth="1.5" opacity="0.6" transform="rotate(-5 90 100)" />
        <rect x="60" y="50" width="70" height="90" rx="8" className="fill-surface-container-lowest" stroke="rgb(var(--color-outline-variant))" strokeWidth="1.5" />

        {/* Lines on document */}
        <rect x="73" y="68" width="44" height="4" rx="2" className="fill-outline-variant" opacity="0.3" />
        <rect x="73" y="80" width="35" height="4" rx="2" className="fill-outline-variant" opacity="0.25" />
        <rect x="73" y="92" width="40" height="4" rx="2" className="fill-outline-variant" opacity="0.2" />
        <rect x="73" y="104" width="28" height="4" rx="2" className="fill-outline-variant" opacity="0.15" />

        {/* Magnifying glass */}
        <circle cx="140" cy="130" r="22" stroke="rgb(var(--color-primary))" strokeWidth="3" fill="none" opacity="0.6" />
        <line x1="156" y1="147" x2="170" y2="162" stroke="rgb(var(--color-primary))" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

        {/* Question mark in magnifier */}
        <text x="140" y="137" textAnchor="middle" className="fill-primary" fontSize="22" fontWeight="700" opacity="0.4">?</text>

        {/* Decorative dots */}
        <circle cx="45" cy="70" r="3" className="fill-primary" opacity="0.15" />
        <circle cx="160" cy="55" r="4" className="fill-tertiary" opacity="0.15" />
        <circle cx="35" cy="140" r="2.5" className="fill-secondary" opacity="0.15" />
      </svg>
    </div>
    <p className="text-on-surface/50 text-base font-bold mb-1">{message}</p>
    <p className="text-on-surface/30 text-sm">{submessage}</p>
  </div>
);
