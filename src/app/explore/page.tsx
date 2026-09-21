"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">Marketplace Discovery</h1>
        <p className="text-xs text-[#6F7485] font-mono">
          Discover, filter, and inspect published AI agents in the AgentSpace ecosystem.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search agents by name, tags, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D101A] border border-white/10 text-xs text-white font-mono placeholder:text-[#6F7485] focus:border-[#8B5CF6] focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all"
        >
          Search
        </button>
      </form>

      {/* Results Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-[#6F7485] space-y-3 bg-[#0D101A] rounded-2xl border border-white/10">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#8B5CF6]" />
          <p>Querying persistent database records...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : agents.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-[#6F7485] bg-[#0D101A] rounded-2xl border border-white/10">
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
