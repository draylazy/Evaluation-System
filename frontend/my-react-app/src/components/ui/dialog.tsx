import React, { createContext, useContext } from 'react';

type DialogContextType = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open ? children : null}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => {
  // Trigger is mostly decorative here; actual open state is controlled externally
  return <>{children}</>;
};

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  const ctx = useContext(DialogContext);
  if (!ctx?.open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div
        {...props}
        className={`bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-4 ${className}`}
      />
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div {...props} className={`mb-4 ${className}`} />
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...props }) => (
  <h3 {...props} className={`text-lg font-semibold text-gray-900 ${className}`} />
);




