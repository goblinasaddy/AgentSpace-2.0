"use client";

import { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { AgentCard } from "@/components/agents/AgentCard";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketplaceAgents();
  }, []);

  const fetchMarketplaceAgents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/marketplace/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setAgents(data.data || []);
      } else {
        setError(data.error?.message || "Failed to query marketplace search.");
      }
    } catch {
      setError("Network error connecting to AgentSpace search API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplaceAgents();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white font-sans">Marketplace Discovery</h1>
        <p className="text-xs text-[#a1a1aa] font-mono">
          Discover, filter, and inspect published AI agents in the AgentSpace ecosystem.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#8b5cf6] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search agents by name, tags, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-[#121215] border border-[#27272a] text-xs text-white font-mono focus:border-[#8b5cf6] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-[#8b5cf6]/20 transition-all"
        >
          Search
        </button>
      </form>

      {/* Results Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-[#a1a1aa] space-y-2 bg-[#121215] rounded-xl border border-[#27272a]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#8b5cf6]" />
          <p>Querying database records...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : agents.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-[#a1a1aa] bg-[#121215] rounded-xl border border-[#27272a]">
          No published agents match your search filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
