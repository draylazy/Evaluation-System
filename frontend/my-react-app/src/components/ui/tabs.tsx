import React, { createContext, useContext, useState } from 'react';

type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = '', children }) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div {...props} className={`inline-flex rounded-md bg-gray-100 p-1 ${className}`} />
);

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className = '', children, ...props }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;
  const isActive = ctx.value === value;
  const base =
    'flex-1 px-3 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors';
  const activeClasses = 'bg-white text-indigo-600 shadow';
  const inactiveClasses = 'text-gray-600 hover:bg-gray-200';

  return (
    <button
      type="button"
      {...props}
      onClick={() => ctx.setValue(value)}
      className={`${base} ${isActive ? activeClasses : inactiveClasses} ${className}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className = '', children, ...props }) => {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
};




