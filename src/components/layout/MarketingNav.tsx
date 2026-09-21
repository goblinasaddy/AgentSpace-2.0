"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Command } from "lucide-react";
import { AgentSpaceLogo } from "../brand/AgentSpaceLogo";
import { CommandPaletteModal } from "../search/CommandPaletteModal";
import { AuthModal } from "../auth/AuthModal";

export function MarketingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("agentspace_token");
    if (savedToken) {
      fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) setAuthUser(data.data);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-300 px-6 lg:px-12 flex items-center justify-between ${
          isScrolled
            ? "bg-[#05050D]/85 backdrop-blur-md border-b border-white/10 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center space-x-10">
          <AgentSpaceLogo size="md" />

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-[#A8ADBD]">
            <Link href="/explore" className="hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href="/battle" className="hover:text-white transition-colors">
              Battle
            </Link>
            <Link href="/build" className="hover:text-white transition-colors">
              Build
            </Link>
            <Link href="/evaluate" className="hover:text-white transition-colors">
              Evaluate
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/community" className="hover:text-white transition-colors">
              Community
            </Link>
          </nav>
        </div>

        {/* Right: Search & Sign In */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono text-[#6F7485] hover:text-[#A8ADBD] transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="hidden sm:inline">Search</span>
            <div className="flex items-center space-x-0.5 text-[10px] bg-white/5 px-1 py-0.5 rounded border border-white/10">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>

          {authUser ? (
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium transition-all shadow-lg shadow-[#8B5CF6]/20"
            >
              Workspace ({authUser.username})
            </Link>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <CommandPaletteModal isOpen={isCmdPaletteOpen} onClose={() => setIsCmdPaletteOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(token, user) => setAuthUser(user)}
      />
    </>
  );
}
