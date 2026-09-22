"use client";

import { useState, useEffect } from "react";
import { Swords, AlertCircle, Trophy } from "lucide-react";

export default function BattlePage() {
  const [battles, setBattles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const [challenge, setChallenge] = useState("Analyze code snippet for security vulnerabilities and suggest patches.");
  const [agentVersionA, setAgentVersionA] = useState("");
  const [agentVersionB, setAgentVersionB] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBattles();
  }, []);

  const fetchBattles = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/v1/battles");
      const data = await res.json();
      if (res.ok) {
        setBattles(data.data || []);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentVersionA || !agentVersionB) {
      alert("Please specify two Agent Version IDs for the battle.");
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
        alert(`Battle Creation Failed: ${data.error?.message || "Invalid input"}`);
      }
    } catch {
      alert("Network error creating battle.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
          <Swords className="w-7 h-7 text-[#8B5CF6]" /> Battle Arena
        </h1>
        <p className="text-xs text-[#6F7485]">
          Compare agent versions side-by-side on identical prompts.
        </p>
      </div>

      {/* Create Battle Panel */}
      <form onSubmit={handleCreateBattle} className="p-6 rounded-2xl bg-[#0D101A] border border-white/10 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white tracking-wide">Create Battle</h2>

        <div>
          <label className="text-xs text-[#6F7485]">Challenge Prompt</label>
          <input
            type="text"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            required
            className="w-full mt-1 p-3 rounded-xl bg-[#05050D] border border-white/10 text-xs text-white focus:border-[#8B5CF6] focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#6F7485]">Agent Version ID #1</label>
            <input
              type="text"
              placeholder="Version ID..."
              value={agentVersionA}
              onChange={(e) => setAgentVersionA(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-xl bg-[#05050D] border border-white/10 text-xs text-white font-mono focus:border-[#8B5CF6] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#6F7485]">Agent Version ID #2</label>
            <input
              type="text"
              placeholder="Version ID..."
              value={agentVersionB}
              onChange={(e) => setAgentVersionB(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-xl bg-[#05050D] border border-white/10 text-xs text-white font-mono focus:border-[#8B5CF6] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#8B5CF6]/20"
        >
          {isCreating ? "Creating Battle..." : "Start Battle"}
        </button>
      </form>

      {/* Battles List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
          <Trophy className="w-4 h-4 text-amber-400" /> Active Battles
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#6F7485] bg-[#0D101A] rounded-2xl border border-white/10">
            Loading battles...
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-2 bg-[#0D101A] rounded-2xl border border-white/10">
            <AlertCircle className="w-5 h-5 mx-auto text-amber-400" />
            <p className="text-xs text-[#6F7485]">Could not load battles right now.</p>
          </div>
        ) : battles.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6F7485] bg-[#0D101A] rounded-2xl border border-white/10">
            No battles created yet.
          </div>
        ) : (
          <div className="space-y-4">
            {battles.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-[#0D101A] border border-white/10 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Battle #{b.id}</span>
                  <span className="text-emerald-400 font-bold uppercase">{b.status}</span>
                </div>
                <p className="text-xs text-[#A8ADBD]">{b.challenge}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#6F7485]">
                  <span>{b.participants?.length || 2} Participant Versions</span>
                  <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
