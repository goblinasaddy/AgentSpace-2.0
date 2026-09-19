"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, Search, Lock, UserCheck, LogOut, Command } from "lucide-react";
import { CommandPaletteModal } from "../search/CommandPaletteModal";
import { AuthModal } from "../auth/AuthModal";

export function TopNav() {
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("agentspace_token");
    if (savedToken) {
      setAuthToken(savedToken);
      fetchAuthUser(savedToken);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCmdPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchAuthUser = async (token: string) => {
    try {
      const res = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAuthUser(data.data);
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const handleAuthSuccess = (token: string, user: any) => {
    setAuthToken(token);
    setAuthUser(user);
    localStorage.setItem("agentspace_token", token);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem("agentspace_token");
  };

  return (
    <>
      <header className="h-14 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur sticky top-0 z-40 px-4 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#a78bfa] transition-colors">
                AgentSpace
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#8b5cf6]/10 text-[#c4b5fd] font-mono border border-[#8b5cf6]/30">
                2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] text-xs font-mono text-[#71717a] transition-all"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-[#8b5cf6]" />
              <span>Search agents, repos, categories...</span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] bg-[#18181b] px-1.5 py-0.5 rounded border border-[#27272a]">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right: Auth Profile */}
        <div className="flex items-center space-x-3">
          {authUser ? (
            <div className="flex items-center space-x-3 bg-[#121215] px-3 py-1.5 rounded-lg border border-[#27272a]">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{authUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-mono text-[#71717a] hover:text-white flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs font-medium transition-all shadow-md shadow-[#8b5cf6]/20 flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </header>

      <CommandPaletteModal isOpen={isCmdPaletteOpen} onClose={() => setIsCmdPaletteOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </>
  );
}
