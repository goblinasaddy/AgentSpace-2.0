"use client";

import { useState, useEffect } from "react";
import { Swords, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BattlePage() {
  const [battles, setBattles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [prompt, setPrompt] = useState("Analyze code snippet for security vulnerabilities and suggest patches.");
  const [agentA, setAgentA] = useState("WebScout v1.4.2");
  const [agentB, setAgentB] = useState("PDF Analyst v1.0.1");
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/battles");
      const data = await res.json();
      if (res.ok) {
        setBattles(data.data || []);
      }
    } catch {
      // Quiet
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Swords className="w-7 h-7 text-[#6D5DF6]" /> Compare Agents
        </h1>
        <p className="text-xs text-[#6F788A]">
          Run two agents on the same task and compare their outputs.
        </p>
      </div>

      {/* Selectors & Challenge Prompt Form */}
      <form onSubmit={handleStartComparison} className="p-6 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
        {/* Agent Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-[#05070B] border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#6D5DF6]/20 text-[#A78BFA] flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="text-xs font-bold text-white">{agentA}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#05070B] border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#4D8DFF]/20 text-[#4D8DFF] flex items-center justify-center font-bold text-xs">
                B
              </div>
              <span className="text-xs font-bold text-white">{agentB}</span>
            </div>
          </div>
        </div>

        <div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a task or question..."
            className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 text-xs text-white placeholder:text-[#6F788A] focus:border-[#6D5DF6] focus:outline-none resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button variant="primary" size="md" type="submit" disabled={isComparing}>
            {isComparing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Comparing...</span>
              </>
            ) : (
              <span>Start Comparison →</span>
            )}
          </Button>
        </div>
      </form>

      {/* Parallel Side-by-Side Comparison Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent A Card */}
        <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-white">{agentA}</span>
            <span className="text-xs text-[#6F788A]">@aditya</span>
          </div>

          <div className="p-3 rounded-lg bg-[#05070B] text-xs font-mono text-[#A7AFBF] space-y-1">
            <p>1. Static security scanning initialized.</p>
            <p>2. Analysis: 0 high-severity vulnerabilities found.</p>
            <p>3. Suggested patch: Add input validation for query parameter.</p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#6F788A]">
            <span>Latency: <strong className="text-white font-mono">12.4s</strong></span>
            <span>Tokens: <strong className="text-white font-mono">2.1k</strong></span>
            <span className="text-[#34D399] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </div>
        </div>

        {/* Agent B Card */}
        <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-bold text-white">{agentB}</span>
            <span className="text-xs text-[#6F788A]">@rishabh</span>
          </div>

          <div className="p-3 rounded-lg bg-[#05070B] text-xs font-mono text-[#A7AFBF] space-y-1">
            <p>1. PDF AST parser loaded.</p>
            <p>2. Security inspection: Checked document stream tags.</p>
            <p>3. Suggested patch: Enforce strict schema on JSON output.</p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#6F788A]">
            <span>Latency: <strong className="text-white font-mono">15.6s</strong></span>
            <span>Tokens: <strong className="text-white font-mono">2.6k</strong></span>
            <span className="text-[#34D399] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
