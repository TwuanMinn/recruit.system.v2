import React from 'react';
import type { ColorSet } from '../../types';

interface BadgeProps {
  label: string;
  colors: ColorSet;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, colors, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold glass-float whitespace-nowrap ${className}`}
    style={{
      color: colors.text,
      border: `1px solid ${colors.border || colors.text}20`,
    }}
  >
    {label}
  </span>
);
