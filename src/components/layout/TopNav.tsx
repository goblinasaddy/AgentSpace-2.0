"use client";

import { useState, useEffect } from "react";
import { Search, Lock, UserCheck, LogOut, Command } from "lucide-react";
import { AgentSpaceLogo } from "../brand/AgentSpaceLogo";
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
      <header className="h-14 border-b border-white/10 bg-[#05050D]/90 backdrop-blur sticky top-0 z-40 px-4 flex items-center justify-between">
        {/* Left: Singular Brand Mark & Name */}
        <div className="flex items-center space-x-3">
          <AgentSpaceLogo size="sm" />
        </div>

        {/* Center: Command Palette Trigger */}
        <div className="flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0D101A] border border-white/10 hover:border-white/20 text-xs font-sans text-[#6F7485] hover:text-[#A8ADBD] transition-all"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Search agents, repos, categories...</span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right: Auth Profile */}
        <div className="flex items-center space-x-3">
          {authUser ? (
            <div className="flex items-center space-x-3 bg-[#0D101A] px-3 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2 text-xs font-sans text-[#34D399]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{authUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-sans text-[#6F7485] hover:text-white flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-sans text-xs font-medium transition-all shadow-md shadow-[#8B5CF6]/20 flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      <CommandPaletteModal isOpen={isCmdPaletteOpen} onClose={() => setIsCmdPaletteOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />
    </>
  );
}
