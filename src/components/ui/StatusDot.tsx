import React from 'react';

interface StatusDotProps {
  label: string;
  color: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ label, color }) => (
  <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color }}>
    <span className="w-2 h-2 rounded-full" style={{ background: color }} aria-hidden="true" />
    {label}
  </span>
);
