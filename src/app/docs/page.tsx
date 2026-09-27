"use client";

import { useState } from "react";

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState("intro");

  const toc = [
    { id: "intro", label: "Introduction" },
    { id: "quickstart", label: "Quickstart" },
    { id: "spec", label: "Agent Specification" },
    { id: "sdk", label: "SDK" },
    { id: "api", label: "API" },
    { id: "tools", label: "Tools" },
    { id: "mcp", label: "MCP" },
    { id: "verification", label: "Verification" },
    { id: "publishing", label: "Publishing" },
    { id: "examples", label: "Examples" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Documentation</h1>
        <p className="text-xs text-[#6F788A]">Everything you need to build on AgentSpace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-2">
        {/* Left TOC Navigation Sidebar */}
        <div className="space-y-2">
          <div className="px-2 text-[11px] font-bold text-[#6F788A] uppercase tracking-wider">
            Getting Started
          </div>
          <nav className="space-y-0.5">
            {toc.map((item) => {
              const isActive = activeDoc === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveDoc(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                    isActive
                      ? "bg-[#6D5DF6]/15 text-white font-bold border border-[#6D5DF6]/30"
                      : "text-[#A7AFBF] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 p-6 rounded-xl bg-[#0D1118] border border-white/10 space-y-6">
          <div className="space-y-2 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Introduction</h2>
            <p className="text-xs text-[#A7AFBF] leading-relaxed">
              Welcome to AgentSpace. Learn how to build, publish, and scale AI agents on an open ecosystem.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">What is AgentSpace?</h3>
            <p className="text-xs text-[#A7AFBF] leading-relaxed">
              AgentSpace is an open platform for AI agents where developers can build, share, discover, run, evaluate and verify agents.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-white">Installation</h3>
            <div className="relative group">
              <pre className="p-3.5 rounded-lg bg-[#05070B] border border-white/5 text-xs font-mono text-[#A7AFBF]">
                npm install @agentspace/sdk
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
