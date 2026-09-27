"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play, ArrowLeft, ChevronRight, CheckCircle2, RefreshCw } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";

export default function RunAgentPage() {
  const params = useParams();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("test");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAgentDetails();
  }, [agentId]);

  const fetchAgentDetails = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/v1/agents/${agentId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setAgent(data.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!prompt.trim()) return;
    setIsExecuting(true);
    setRunResult(null);
    try {
      const latestVerId = agent.versions?.[0]?.id || "v1";
      const token = localStorage.getItem("agentspace_token");
      const res = await fetch(`/api/v1/agents/${agentId}/runs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          agentVersionId: latestVerId,
          input: { prompt },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRunResult(data.data);
      } else {
        alert(`Execution failed: ${data.error?.message || "Error"}`);
      }
    } catch {
      alert("Network error executing agent.");
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-xs text-[#6F788A]">
        Loading playground...
      </div>
    );
  }

  if (error || !agent) {
    return (
      <ErrorState
        title="Agent not found."
        description="We couldn't load the run environment for this agent."
        onRetry={() => fetchAgentDetails()}
      />
    );
  }

  const latestVersion = agent.versions && agent.versions.length > 0 ? agent.versions[0].version : "1.4.2";
  const examplePrompts = [
    "Research latest AI papers",
    "Summarize a website",
    "Compare two topics",
  ];

  const inputTabs = [
    { id: "test", label: "Test" },
    { id: "json", label: "JSON" },
    { id: "file", label: "File" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#6F788A]">
        <Link href={`/agents/${agent.id}`} className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{agent.name}</span>
        </Link>
        <span>&gt;</span>
        <span className="text-white font-medium">Run</span>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Run {agent.name}</h1>
        <p className="text-xs text-[#6F788A]">Execute the agent with your input.</p>
      </div>

      {/* Main Grid: Input Playground + Execution Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Input Workspace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
            <Tabs tabs={inputTabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="space-y-2">
              <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your task or question..."
                className="w-full p-3 rounded-lg bg-[#05070B] border border-white/10 text-xs text-white placeholder:text-[#6F788A] focus:border-[#6D5DF6] focus:outline-none transition-colors font-sans resize-none"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-[#6F788A]">Example prompts:</span>
                {examplePrompts.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[11px] text-[#A7AFBF] border border-white/5 transition-all"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button className="text-xs text-[#6F788A] hover:text-white flex items-center gap-1 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Advanced Options</span>
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={handleExecute}
                disabled={isExecuting || !prompt.trim()}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Agent →</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Execution Result Area */}
          {runResult && (
            <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-white font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399]" /> Output Result
                </span>
                <span className="text-[11px] font-mono text-[#6F788A]">
                  Latency: {runResult.latencyMs || 1200}ms
                </span>
              </div>
              <pre className="p-3 rounded-lg bg-[#05070B] border border-white/5 text-xs font-mono text-[#A7AFBF] overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(runResult.output || runResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Execution Sidebar */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide">Execution</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-[#6F788A]">Status</span>
                <span className="text-[#34D399] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] inline-block animate-pulse" />
                  Ready to run
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6F788A]">Model</span>
                <span className="text-white font-mono">gemini-1.5-pro</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6F788A]">Version</span>
                <span className="text-white font-mono">v{latestVersion}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
