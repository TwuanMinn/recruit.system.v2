import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="mb-4">
      <label className="block text-[0.6875rem] font-bold tracking-[0.05em] uppercase text-on-surface/80 mb-1.5">
        {label}
      </label>
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-surface border rounded-xl text-sm text-on-surface font-medium placeholder:text-on-surface/50 outline-none transition-all ${
          error
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-outline-variant/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20'
        }`}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-error text-xs font-medium mt-1" role="alert">{error}</p>
      )}
    </div>
  )
);
Input.displayName = 'Input';
