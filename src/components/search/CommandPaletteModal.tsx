"use client";

import { useState, useEffect } from "react";
import { Search, X, FolderGit2, Cpu, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPaletteModal({ isOpen, onClose }: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/marketplace/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data.data || []);
        }
      } catch (err) {
        console.error("Command palette search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-[#121215] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-[#27272a]">
          <Search className="w-5 h-5 text-[#8b5cf6] mr-3" />
          <input
            type="text"
            placeholder="Search agents, repositories, categories... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-mono text-white placeholder-[#71717a] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-[#71717a] hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Box */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-4 text-center text-xs font-mono text-[#a1a1aa]">Searching AgentSpace database...</div>
          ) : query && results.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-[#a1a1aa]">
              No agents or repositories found for &quot;{query}&quot;.
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={`/agents/${item.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 hover:bg-[#18181b] rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[#a78bfa]" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white group-hover:text-[#c4b5fd]">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#a1a1aa] line-clamp-1">{item.description || "No description"}</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white" />
              </Link>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-[#27272a] bg-[#09090b] text-[10px] font-mono text-[#71717a] flex items-center justify-between">
          <span>AgentSpace Command Palette</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
