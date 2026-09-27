"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { AgentCard } from "@/components/agents/AgentCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const categories = [
    "All",
    "Research",
    "Development",
    "Productivity",
    "Data",
    "Business",
    "Creative",
    "Education",
  ];

  useEffect(() => {
    fetchMarketplaceAgents();
  }, [activeCategory]);

  const fetchMarketplaceAgents = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const categoryParam = activeCategory !== "All" ? `&category=${encodeURIComponent(activeCategory)}` : "";
      const res = await fetch(`/api/v1/marketplace/search?q=${encodeURIComponent(query)}${categoryParam}`);
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Explore Agents</h1>
        <p className="text-xs text-[#6F788A]">
          Discover agents built by the community.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#6D5DF6] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search agents, tools, or creators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0D1118] border border-white/10 text-xs text-white placeholder:text-[#6F788A] focus:border-[#6D5DF6] focus:outline-none transition-colors"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2.5 bg-[#0D1118] hover:bg-[#111722] text-[#A7AFBF] hover:text-white text-xs font-medium rounded-lg border border-white/10 flex items-center justify-center space-x-2 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#6D5DF6]" />
          <span>Filters</span>
        </button>
      </form>

      {/* Category Pills & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#6D5DF6] text-white"
                    : "bg-white/5 hover:bg-white/10 text-[#A7AFBF] hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-[#6F788A]">
          <ArrowUpDown className="w-3 h-3 text-[#6D5DF6]" />
          <span>Sort:</span>
          <span className="text-white font-medium">Trending ↓</span>
        </div>
      </div>

      {/* Results List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : error ? (
        <ErrorState
          title="Something went wrong."
          description="We couldn't load the marketplace right now."
          onRetry={() => fetchMarketplaceAgents()}
        />
      ) : agents.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#6F788A] bg-[#0D1118] rounded-lg border border-white/10">
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
