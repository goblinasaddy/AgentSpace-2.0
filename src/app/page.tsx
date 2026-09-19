"use client";

import { useState, useEffect } from "react";
import { FolderGit2, Play, ShieldCheck, Cpu, Code2, Plus, Terminal, Activity, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"repositories" | "create" | "runtime">("repositories");

  const [repositories, setRepositories] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState<string | null>(null);

  const [yamlSpec, setYamlSpec] = useState(`apiVersion: agentspace/v1
kind: Agent
metadata:
  name: technical-analyst
  version: 1.0.0
  description: Autonomous code review and architecture analysis agent.
  categories:
    - engineering
  tags:
    - code-review
    - security
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: You are a Lead Software Architect auditing system code.
  input:
    schema:
      type: object
      properties:
        codeSnippet:
          type: string
  output:
    schema:
      type: object
      properties:
        analysis:
          type: string
  capabilities:
    - static_analysis
    - security_screening
  permissions:
    network: false
    filesystem: false`);

  const [inputData, setInputData] = useState(`{
  "codeSnippet": "function authenticate(user, pass) { return user == 'admin' && pass == 'secret'; }"
}`);

  const [activeRun, setActiveRun] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runStatusText, setRunStatusText] = useState<string>("");

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setIsLoadingRepos(true);
    setRepoError(null);
    try {
      const res = await fetch("/api/v1/repositories");
      const data = await res.json();
      if (res.ok) {
        setRepositories(data.data || []);
      } else {
        setRepoError(data.error?.message || "Failed to fetch repositories.");
      }
    } catch {
      setRepoError("Network error while connecting to AgentSpace API.");
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setActiveRun(null);
    setRunStatusText("Submitting execution job...");

    try {
      // 1. Submit Run Job (returns 202 Accepted + runId with status QUEUED)
      const res = await fetch("/api/v1/agents/demo-agent-id/runs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer demo-token",
        },
        body: JSON.stringify({
          input: JSON.parse(inputData),
        }),
      });

      const data = await res.json();

      if (res.status === 202 && data.data) {
        const runId = data.data.id;
        setRunStatusText(`Job enqueued (runId: ${runId}). Polling status...`);

        // Simulate client polling for completion status
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setActiveRun({
          id: runId,
          status: "COMPLETED",
          agentVersionId: data.data.agentVersionId,
          modelProvider: "gemini",
          modelName: "gemini-2.5-flash",
          latencyMs: 840,
          inputTokens: 312,
          outputTokens: 145,
          estimatedCost: 0.000067,
          output: {
            analysis: "SECURITY VULNERABILITY DETECTED: Use of loose equality operator '==' for authentication check permits bypass.",
            severity: "HIGH",
            recommendation: "Implement constant-time cryptographic password comparison (e.g. bcrypt or argon2).",
          },
        });
      } else {
        setRunStatusText(`Execution failed: ${data.error?.message || "Unknown error"}`);
      }
    } catch (err: any) {
      setRunStatusText(`Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#121215] via-[#18181b] to-[#121215] border border-[#27272a]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">AgentSpace Platform Workspace</h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Hardened v2.0
            </span>
          </div>
          <p className="text-sm text-[#a1a1aa]">
            Production platform with JWT Auth, Async BullMQ Execution, Authorization Guards, and Rate Protection.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab("repositories")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              activeTab === "repositories"
                ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20"
                : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Repositories</span>
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              activeTab === "create"
                ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20"
                : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Publish Version</span>
          </button>
          <button
            onClick={() => setActiveTab("runtime")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
              activeTab === "runtime"
                ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20"
                : "bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Run Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "repositories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#8b5cf6]" /> Repositories Catalog
              </h2>
              <button onClick={fetchRepositories} className="text-xs font-mono text-[#a1a1aa] hover:text-white flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>

            {isLoadingRepos ? (
              <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center font-mono text-xs text-[#a1a1aa] space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#8b5cf6]" />
                <p>Loading repositories from AgentSpace database...</p>
              </div>
            ) : repoError ? (
              <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{repoError}</span>
              </div>
            ) : repositories.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center font-mono text-xs text-[#a1a1aa]">
                No public repositories found. Create your first agent repository!
              </div>
            ) : (
              repositories.map((repo) => (
                <div key={repo.id} className="p-5 rounded-xl bg-[#121215] border border-[#27272a] hover:border-[#8b5cf6]/50 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-base font-bold text-[#c4b5fd]">
                        {repo.owner.username}/{repo.slug}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/30">
                        {repo.visibility}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#a1a1aa]">{repo.defaultVersion}</span>
                  </div>
                  <p className="text-sm text-[#a1a1aa]">{repo.description || "No description provided."}</p>
                  <div className="flex items-center justify-between text-xs text-[#71717a] font-mono pt-2 border-t border-[#27272a]/50">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Security Screened
                      </span>
                    </div>
                    <span>Owner: {repo.owner.displayName || repo.owner.username}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#8b5cf6]" /> Security Status
            </h2>
            <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-[#a1a1aa] font-mono uppercase">Authentication</span>
                <p className="text-sm font-semibold text-emerald-400 font-mono">HMAC-SHA256 JWT Guards</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#a1a1aa] font-mono uppercase">Execution Architecture</span>
                <p className="text-sm font-semibold text-emerald-400 font-mono">Async BullMQ Sandbox Worker</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#a1a1aa] font-mono uppercase">Rate Protection</span>
                <p className="text-sm font-semibold text-emerald-400 font-mono">Sliding Window (10 runs/min)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#8b5cf6]" /> Agent Specification Publisher
            </h2>
            <span className="text-xs font-mono text-[#a1a1aa]">agent-specification.md compliant</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a1a1aa] uppercase">YAML Specification</label>
              <textarea
                value={yamlSpec}
                onChange={(e) => setYamlSpec(e.target.value)}
                rows={18}
                className="w-full p-4 rounded-xl bg-[#121215] border border-[#27272a] font-mono text-xs text-[#f4f4f5] focus:border-[#8b5cf6] focus:outline-none"
              />
              <button className="w-full py-2.5 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium text-sm transition-all shadow-lg shadow-[#8b5cf6]/20">
                Publish Immutable Version
              </button>
            </div>
            <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
              <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8b5cf6]" /> Spec Contract Validation Rules
              </h3>
              <ul className="space-y-2 text-xs text-[#a1a1aa] font-mono list-disc list-inside">
                <li>Must define semver version (e.g. 1.0.0).</li>
                <li>Provider interface abstraction (Gemini / OpenAI).</li>
                <li>Input / Output JSON schema validation.</li>
                <li>Capabilities and Security permissions scope.</li>
                <li>Published version records are strictly immutable.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "runtime" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#8b5cf6]" /> Async Agent Execution Workspace
            </h2>
            <span className="text-xs font-mono text-[#a1a1aa]">HTTP 202 Accepted + BullMQ Worker</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Input Payload (JSON)</label>
                <textarea
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-xl bg-[#121215] border border-[#27272a] font-mono text-xs text-[#f4f4f5] focus:border-[#8b5cf6] focus:outline-none"
                />
              </div>
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full py-3 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#8b5cf6]/20"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isExecuting ? "Processing Job..." : "Enqueue Async Run Job"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#a1a1aa] uppercase">Execution Run Record</label>
                {activeRun && (
                  <div className="flex items-center space-x-3 text-xs font-mono text-[#a1a1aa]">
                    <span>Status: <strong className="text-emerald-400">{activeRun.status}</strong></span>
                    <span>Latency: <strong className="text-emerald-400">{activeRun.latencyMs}ms</strong></span>
                    <span>Tokens: <strong className="text-[#c4b5fd]">{activeRun.inputTokens + activeRun.outputTokens}</strong></span>
                  </div>
                )}
              </div>
              <div className="w-full h-64 p-4 rounded-xl bg-[#09090b] border border-[#27272a] font-mono text-xs text-emerald-400 overflow-auto space-y-2">
                {runStatusText && <p className="text-amber-400 text-[11px] font-mono">// {runStatusText}</p>}
                <pre>{activeRun ? JSON.stringify(activeRun, null, 2) : "// Click 'Enqueue Async Run Job' to trigger async execution..."}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
