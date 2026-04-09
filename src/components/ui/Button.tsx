import React from 'react';
import { Icon } from './Icon';

type BtnVariant = 'primary' | 'success' | 'danger' | 'ghost' | 'pdf' | 'tonal';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  icon?: string;
}

const variantMap: Record<BtnVariant, string> = {
  primary: 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5',
  success: 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-0.5',
  danger: 'bg-error text-on-error shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 hover:-translate-y-0.5',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
  pdf: 'bg-error text-on-error shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 hover:-translate-y-0.5',
  tonal: 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high hover:-translate-y-0.5 hover:shadow-md',
};

export const Btn: React.FC<BtnProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => (
  <button
    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
      transition-all duration-200 ease-out
      active:scale-95 active:translate-y-0 active:shadow-sm
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
      ${variantMap[variant]} ${className}`}
    {...props}
  >
    {icon && <Icon name={icon} className="text-lg transition-transform duration-200 group-hover:scale-110" />}
    {children}
  </button>
);
