"use client";

import { useState, useEffect, use } from "react";
import { Terminal, Play, CheckCircle2, AlertCircle, RefreshCw, Cpu } from "lucide-react";
import Link from "next/link";

export default function AgentRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentId } = use(params);
  const [agent, setAgent] = useState<any>(null);
  const [inputData, setInputData] = useState(`{\n  "codeSnippet": "function checkUser(u, p) { return u === 'admin' && p === 'secret'; }"\n}`);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeRun, setActiveRun] = useState<any>(null);
  const [statusText, setStatusText] = useState<string>("");

  useEffect(() => {
    fetchAgentDetails();
  }, [agentId]);

  const fetchAgentDetails = async () => {
    try {
      const res = await fetch(`/api/v1/agents?id=${agentId}`);
      const data = await res.json();
      if (res.ok) {
        setAgent(data.data);
      }
    } catch (err) {
      console.error("Fetch agent error:", err);
    }
  };

  const handleExecuteRun = async () => {
    setIsExecuting(true);
    setActiveRun(null);
    setStatusText("Submitting execution job (POST /api/v1/agents/[id]/runs)...");

    try {
      const savedToken = localStorage.getItem("agentspace_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (savedToken) headers["Authorization"] = `Bearer ${savedToken}`;

      const res = await fetch(`/api/v1/agents/${agentId}/runs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ input: JSON.parse(inputData) }),
      });

      const data = await res.json();

      if (res.status === 202 && data.data) {
        const runId = data.data.id;
        setStatusText(`Job enqueued (HTTP 202 Accepted, runId: ${runId}). Polling status...`);

        // Real Polling Loop
        let attempts = 0;
        const maxPolls = 25;

        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const pollRes = await fetch(`/api/v1/runs/${runId}`);
            const pollData = await pollRes.json();

            if (pollRes.ok && pollData.data) {
              const currentRun = pollData.data;
              setActiveRun(currentRun);

              if (currentRun.status === "COMPLETED" || currentRun.status === "FAILED" || currentRun.status === "TIMED_OUT") {
                clearInterval(pollInterval);
                setIsExecuting(false);
                setStatusText(`Execution Completed with Status: ${currentRun.status}`);
              } else {
                setStatusText(`Polling status for runId: ${runId} (${currentRun.status}, attempt ${attempts})...`);
              }
            }
          } catch (pollErr: any) {
            console.error("Polling error:", pollErr);
          }

          if (attempts >= maxPolls) {
            clearInterval(pollInterval);
            setIsExecuting(false);
            setStatusText("Polling timeout reached.");
          }
        }, 800);
      } else {
        setStatusText(`Execution Error: ${data.error?.message || "Job submission rejected."}`);
        setIsExecuting(false);
      }
    } catch (err: any) {
      setStatusText(`Error: ${err.message}`);
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#121215] border border-[#27272a] rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#a78bfa]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-mono">{agent?.name || "Agent Execution Workspace"}</h1>
            <div className="text-xs text-[#a1a1aa] font-mono">
              Target Agent ID: <strong className="text-white">{agentId}</strong>
            </div>
          </div>
        </div>
        <Link
          href={`/agents/${agentId}`}
          className="text-xs font-mono text-[#a78bfa] hover:underline"
        >
          ← Return to Overview
        </Link>
      </div>

      {/* Main Execution Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#a1a1aa] uppercase">Input Payload (JSON)</label>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-xl bg-[#121215] border border-[#27272a] font-mono text-xs text-white focus:border-[#8b5cf6] focus:outline-none"
            />
          </div>

          <button
            onClick={handleExecuteRun}
            disabled={isExecuting}
            className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-[#8b5cf6]/20 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isExecuting ? "Executing Async Run..." : "Enqueue Async Run Job"}</span>
          </button>
        </div>

        {/* Live Output & Execution Metadata Console */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#a1a1aa]">
            <span>Execution Console</span>
            {activeRun && (
              <span className="text-emerald-400">
                Latency: {activeRun.latencyMs ? `${activeRun.latencyMs}ms` : "N/A"}
              </span>
            )}
          </div>
          <div className="w-full h-[380px] p-4 rounded-xl bg-[#09090b] border border-[#27272a] font-mono text-xs text-emerald-400 overflow-auto space-y-2">
            {statusText && <p className="text-amber-400 text-[11px]">// {statusText}</p>}
            <pre>{activeRun ? JSON.stringify(activeRun, null, 2) : "// Awaiting job execution submission..."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
