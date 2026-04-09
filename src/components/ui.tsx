import React from 'react';
import type { ColorSet, InterviewStatus } from '../types';
import { confirmColors } from '../constants';

// ===== Badge =====
interface BadgeProps {
  label: string;
  colors: ColorSet;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, colors, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide transition-all duration-150 ${className}`}
    style={{
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border || colors.bg}`,
    }}
  >
    {label}
  </span>
);

// ===== Input =====
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
      {label}
    </label>
    <input
      className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-gray-300"
      {...props}
    />
  </div>
);

// ===== TextArea =====
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
      {label}
    </label>
    <textarea
      className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-gray-300 resize-y min-h-[80px]"
      rows={3}
      {...props}
    />
  </div>
);

// ===== Select =====
interface SelectOption {
  value: string;
  label: string;
}

interface SelProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export const Sel: React.FC<SelProps> = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
      {label}
    </label>
    <select
      className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-sm text-gray-800 bg-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 hover:border-gray-300 cursor-pointer"
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// ===== Button =====
type BtnVariant = 'primary' | 'success' | 'danger' | 'ghost' | 'pdf' | 'secondary';

const variantClasses: Record<BtnVariant, string> = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5',
  success:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5',
  ghost:
    'bg-transparent text-brand-500 border border-gray-200 hover:bg-brand-50 hover:border-brand-200',
  pdf:
    'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
}

export const Btn: React.FC<BtnProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => (
  <button
    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-[13px] cursor-pointer border-none transition-all duration-200 active:scale-[0.97] ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ===== Confirm Picker =====
interface ConfirmPickerProps {
  value: InterviewStatus;
  onChange: (v: InterviewStatus) => void;
}

const statusOptions: InterviewStatus[] = ['Confirmed', 'Rejected', 'No Response'];

export const ConfirmPicker: React.FC<ConfirmPickerProps> = ({ value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold text-gray-600 mb-2 tracking-wide uppercase">
      Interview Confirmation
    </label>
    <div className="flex gap-3">
      {statusOptions.map((opt) => {
        const c = confirmColors[opt];
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-3 px-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 text-[13px] font-medium hover:-translate-y-0.5 ${
              selected ? 'font-bold scale-[1.02]' : 'bg-white border-2 border-gray-200 text-gray-500'
            }`}
            style={
              selected
                ? {
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: c.border,
                    background: c.bg,
                    color: c.text,
                    boxShadow: `0 0 0 3px ${c.border}22`,
                  }
                : undefined
            }
          >
            <span className="text-base">{c.icon}</span>
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

// ===== Format Salary =====
export function formatSalary(v: string | number): string {
  return v ? Number(v).toLocaleString('en-US') : '';
}
