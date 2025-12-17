import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({ className = '', ...props }) => {
  return <label {...props} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} />;
};




