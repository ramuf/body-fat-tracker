"use client";

import * as React from "react";
import { CheckCircle, AlertTriangle, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

type AlertVariant = "success" | "error" | "info";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
}

export function Alert({
  variant = "info",
  title,
  description,
  onClose,
  className,
  ...props
}: AlertProps) {
  const Icon = variant === "success" ? CheckCircle : variant === "error" ? AlertTriangle : CheckCircle;

  const base = "border rounded-md px-4 py-2 flex items-start gap-3";
  const colors =
    variant === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : variant === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : "bg-blue-50 border-blue-200 text-blue-800";

  return (
    <div role="status" className={cn(base, colors, className)} {...props}>
      <div className="mt-0.5">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm mt-0.5">{description}</div>}
      </div>
      {onClose && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default Alert;
