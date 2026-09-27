"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong.",
  description = "We couldn't load this content right now.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-8 text-center bg-[#0D1118] rounded-lg border border-white/10 space-y-3 max-w-md mx-auto">
      <AlertCircle className="w-6 h-6 text-[#FBBF24] mx-auto" />
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white font-sans">{title}</h3>
        <p className="text-xs text-[#6F788A] font-sans leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs font-sans font-medium border border-white/10 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6F788A]" />
            <span>Try again</span>
          </button>
        </div>
      )}
    </div>
  );
}
