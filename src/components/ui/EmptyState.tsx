"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="p-12 text-center bg-[#0D1118] rounded-lg border border-white/10 space-y-4 max-w-md mx-auto">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white font-sans">{title}</h3>
        <p className="text-xs text-[#6F788A] font-sans leading-relaxed">{description}</p>
      </div>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#6D5DF6] hover:bg-[#5C4CE5] text-white text-xs font-sans font-medium transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#6D5DF6] hover:bg-[#5C4CE5] text-white text-xs font-sans font-medium transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
