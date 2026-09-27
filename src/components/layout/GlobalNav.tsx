"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Command, User, LogOut } from "lucide-react";
import { AgentSpaceLogo } from "../brand/AgentSpaceLogo";
import { CommandPaletteModal } from "../search/CommandPaletteModal";
import { AuthModal } from "../auth/AuthModal";

export function GlobalNav() {
  const pathname = usePathname();
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

  const navLinks = [
    { label: "Marketplace", href: "/explore" },
    { label: "Battle", href: "/battle" },
    { label: "Build", href: "/build" },
    { label: "Evaluate", href: "/evaluate" },
    { label: "Docs", href: "/docs" },
    { label: "Community", href: "/community" },
  ];

  return (
    <>
      <header className="h-14 border-b border-white/10 bg-[#05070B]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between font-sans">
        {/* Left: Singular Brand & Main Nav Links */}
        <div className="flex items-center space-x-8">
          <AgentSpaceLogo size="md" />

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-[#A7AFBF]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-white ${
                    isActive ? "text-white font-semibold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search & Authentication */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCmdPaletteOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#0D1118] border border-white/10 hover:border-white/20 text-xs text-[#6F788A] hover:text-[#A7AFBF] transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#6D5DF6]" />
            <span className="hidden sm:inline">Search...</span>
            <div className="hidden sm:flex items-center space-x-0.5 text-[10px] bg-white/5 px-1 py-0.5 rounded border border-white/10 font-mono">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>

          {authUser ? (
            <div className="flex items-center space-x-3 bg-[#0D1118] px-3 py-1.5 rounded-md border border-white/10">
              <Link
                href="/dashboard"
                className="flex items-center space-x-1.5 text-xs text-white hover:text-[#A78BFA] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{authUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-[#6F788A] hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-1.5 rounded-md bg-[#6D5DF6] hover:bg-[#5C4CE5] text-white text-xs font-medium transition-all shadow-sm shadow-[#6D5DF6]/20"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <CommandPaletteModal
        isOpen={isCmdPaletteOpen}
        onClose={() => setIsCmdPaletteOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
