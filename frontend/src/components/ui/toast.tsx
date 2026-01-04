"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { X as XIcon, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ToastVariant = "success" | "error" | "info";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // milliseconds
};

type ToastContextValue = {
  toast: (t: Omit<Toast, 'id'>) => string;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const toastObj: Toast = { id, ...t };
    setToasts((prev) => [toastObj, ...prev]);
    if (toastObj.duration && toastObj.duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), toastObj.duration);
    } else {
      // default 4000
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
    }
    return id;
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast, remove }), [toast, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-50 right-4 bottom-4 flex flex-col gap-3 max-w-sm">
        {toasts.map((t) => (
          <ToastView key={t.id} {...t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ id, title, description, variant = 'info', onClose }: Toast & { onClose: () => void }) {
  const Icon = variant === 'success' ? CheckCircle : variant === 'error' ? AlertTriangle : CheckCircle;
  const bg = variant === 'success' ? 'bg-green-50 border-green-200 text-green-800' : variant === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800';

  return (
    <div className={cn('border rounded-md px-3 py-2 shadow-lg flex items-start gap-3', bg)}>
      <div className="mt-0.5">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        {title && <div className="font-medium text-sm">{title}</div>}
        {description && <div className="text-sm mt-0.5">{description}</div>}
      </div>
      <div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default ToastProvider;
