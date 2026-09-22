"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, AlertCircle } from "lucide-react";
import { AgentCard } from "@/components/agents/AgentCard";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    fetchMarketplaceAgents();
  }, []);

  const fetchMarketplaceAgents = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/v1/marketplace/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setAgents(data.data || []);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplaceAgents();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Agents</h1>
        <p className="text-xs text-[#6F7485]">
          Search agents, tools, and capabilities.
        </p>
      </div>

      {/* Search Controls */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search agents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0D101A] border border-white/10 text-xs text-white placeholder:text-[#6F7485] focus:border-[#8B5CF6] focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md shadow-[#8B5CF6]/20 transition-all"
        >
          Search
        </button>
      </form>

      {/* Results Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#6F7485] space-y-3 bg-[#0D101A] rounded-2xl border border-white/10">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#8B5CF6]" />
          <p>Loading agents...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center space-y-3 bg-[#0D101A] rounded-2xl border border-white/10">
          <AlertCircle className="w-6 h-6 mx-auto text-amber-400" />
          <p className="text-sm text-white font-medium">Something went wrong.</p>
          <p className="text-xs text-[#6F7485]">We couldn't load the marketplace right now.</p>
          <div className="pt-2">
            <button
              onClick={() => fetchMarketplaceAgents()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#6F7485] bg-[#0D101A] rounded-2xl border border-white/10">
          No agents match your search query.
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
