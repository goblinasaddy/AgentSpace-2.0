"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = "", hoverable = false }: CardProps) {
  return (
    <div
      className={`p-5 rounded-lg bg-[#0D1118] border border-white/10 ${
        hoverable ? "hover:border-white/20 transition-all duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
