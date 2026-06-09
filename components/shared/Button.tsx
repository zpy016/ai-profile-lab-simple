import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'delta' | 'delta-reject';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  delta: 'btn-delta',
  'delta-reject': 'btn-delta text-text-secondary border-border hover:text-error hover:border-error hover:bg-error-surface',
};

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
