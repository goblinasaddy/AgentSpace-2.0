"use client";

import { useState, useEffect } from "react";
import { Swords, RefreshCw, AlertCircle, Play, Trophy } from "lucide-react";

export default function BattlePage() {
  const [battles, setBattles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [challenge, setChallenge] = useState("Analyze code snippet for security vulnerabilities and suggest patches.");
  const [agentVersionA, setAgentVersionA] = useState("");
  const [agentVersionB, setAgentVersionB] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/battles");
      const data = await res.json();
      if (res.ok) {
        setBattles(data.data || []);
      } else {
        setError(data.error?.message || "Failed to fetch battles.");
      }
    } catch {
      setError("Network error connecting to AgentSpace Battle API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentVersionA || !agentVersionB) {
      alert("Please specify two AgentVersion IDs for the battle.");
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem("agentspace_token");
      const res = await fetch("/api/v1/battles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          challenge,
          participantVersionIds: [agentVersionA, agentVersionB],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAgentVersionA("");
        setAgentVersionB("");
        fetchBattles();
      } else {
        alert(`Battle Creation Rejected: ${data.error?.message}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
          <Swords className="w-6 h-6 text-[#8b5cf6]" /> Battle Mode Arena
        </h1>
        <p className="text-xs text-[#a1a1aa] font-mono">
          Compare agent version outputs side-by-side on identical challenges and record preference votes.
        </p>
      </div>

      {/* Create Battle Panel */}
      <form onSubmit={handleCreateBattle} className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase">Create Agent Battle Challenge</h2>

        <div>
          <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Challenge Prompt</label>
          <input
            type="text"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            required
            className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Participant AgentVersion ID #1</label>
            <input
              type="text"
              placeholder="e.g. cm123agentv1"
              value={agentVersionA}
              onChange={(e) => setAgentVersionA(e.target.value)}
              required
              className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Participant AgentVersion ID #2</label>
            <input
              type="text"
              placeholder="e.g. cm123agentv2"
              value={agentVersionB}
              onChange={(e) => setAgentVersionB(e.target.value)}
              required
              className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md shadow-[#8b5cf6]/20"
        >
          {isCreating ? "Initializing Battle..." : "Initiate Battle"}
        </button>
      </form>

      {/* Battles Arena List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" /> Persistent Battles Arena
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-[#a1a1aa] bg-[#121215] rounded-xl border border-[#27272a]">
            Loading battles...
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : battles.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#a1a1aa] bg-[#121215] rounded-xl border border-[#27272a]">
            No battles created yet. Initiate your first battle above!
          </div>
        ) : (
          <div className="space-y-4">
            {battles.map((b) => (
              <div key={b.id} className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Battle #{b.id}</span>
                  <span className="text-emerald-400 font-bold uppercase">{b.status}</span>
                </div>
                <p className="text-xs text-[#a1a1aa] font-mono">{b.challenge}</p>
                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[11px] font-mono text-[#71717a]">
                  <span>Participants: {b.participants?.length || 2} Agent Versions</span>
                  <span>Created: {new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
