import React from 'react';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

// Simple badge component used for status pills and labels
export const Badge: React.FC<BadgeProps> = ({ className = '', ...props }) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  return <span {...props} className={`${base} ${className}`} />;
};
