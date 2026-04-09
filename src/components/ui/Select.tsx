import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export const Sel = React.forwardRef<HTMLSelectElement, SelProps>(
  ({ label, options, ...props }, ref) => (
    <div className="mb-4">
      <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/80 mb-1.5">
        {label}
      </label>
      <select
        ref={ref}
        className="w-full px-4 py-2.5 bg-surface border border-outline-variant/20 rounded-xl text-sm text-on-surface font-medium focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
);
Sel.displayName = 'Sel';
