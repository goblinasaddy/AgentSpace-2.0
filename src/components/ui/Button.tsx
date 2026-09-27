"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-medium rounded-md transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none";

  const variantClasses = {
    primary:
      "bg-[#6D5DF6] hover:bg-[#5C4CE5] text-white shadow-sm shadow-[#6D5DF6]/20 border border-[#6D5DF6]/50",
    secondary:
      "bg-[#0D1118] hover:bg-[#111722] text-[#F5F7FA] border border-white/10 hover:border-white/20",
    ghost: "bg-transparent hover:bg-white/5 text-[#A7AFBF] hover:text-white",
    danger: "bg-[#FB7185]/15 hover:bg-[#FB7185]/25 text-[#FB7185] border border-[#FB7185]/30",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs gap-2",
    lg: "px-6 py-2.5 text-sm gap-2.5",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
