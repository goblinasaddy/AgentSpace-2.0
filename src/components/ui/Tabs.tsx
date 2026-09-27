"use client";

import React from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex items-center space-x-1 border-b border-white/10 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-xs font-sans font-medium transition-all relative flex items-center space-x-2 ${
              isActive
                ? "text-white font-semibold"
                : "text-[#6F788A] hover:text-[#A7AFBF]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? "bg-[#6D5DF6]/20 text-[#A78BFA]" : "bg-white/5 text-[#6F788A]"
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D5DF6] rounded-t" />
            )}
          </button>
        );
      })}
    </div>
  );
}
