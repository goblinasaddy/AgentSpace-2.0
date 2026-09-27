"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, ShieldAlert, Zap } from "lucide-react";

interface BadgeProps {
  variant?: "success" | "info" | "warning" | "neutral" | "verified";
  size?: "sm" | "md";
  children: React.ReactNode;
  icon?: boolean;
}

export function Badge({
  variant = "neutral",
  size = "sm",
  children,
  icon = false,
}: BadgeProps) {
  const variantClasses = {
    verified: "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30",
    success: "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30",
    info: "bg-[#4D8DFF]/15 text-[#4D8DFF] border border-[#4D8DFF]/30",
    warning: "bg-[#FBBF24]/15 text-[#FBBF24] border border-[#FBBF24]/30",
    neutral: "bg-white/5 text-[#A7AFBF] border border-white/10",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {icon && (variant === "verified" || variant === "success") && (
        <CheckCircle2 className="w-3 h-3" />
      )}
      {children}
    </span>
  );
}
