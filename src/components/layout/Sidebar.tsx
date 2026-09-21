"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  FolderGit2,
  Swords,
  Award,
  LayoutDashboard,
  Layers,
  Wrench,
  Terminal,
} from "lucide-react";
import { AgentSpaceLogo } from "../brand/AgentSpaceLogo";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore Agents", href: "/explore", icon: Search },
    { label: "Repositories", href: "/dashboard", icon: FolderGit2 },
    { label: "Battle Mode", href: "/battle", icon: Swords },
    { label: "Trust & Verification", href: "/verification", icon: Award },
    { label: "My Workspace", href: "/dashboard", icon: LayoutDashboard },
  ];

  const upcomingCategories = [
    { label: "Tools Marketplace", icon: Wrench },
    { label: "Skills Ecosystem", icon: Layers },
    { label: "MCP Servers", icon: Terminal },
  ];

  return (
    <aside className="w-60 border-r border-white/10 bg-[#05050D] flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-3 space-y-6">
        {/* Platform Nav */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6F7485]">
            Platform Lifecycle
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                    isActive
                      ? "bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30 font-bold shadow-sm"
                      : "text-[#A8ADBD] hover:text-white hover:bg-[#0D101A]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#8B5CF6]" : "text-[#6F7485]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Future Product Scope Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6F7485]">
            Upcoming Ecosystem Modules
          </div>
          <div className="space-y-1">
            {upcomingCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-[#6F7485] cursor-not-allowed opacity-60"
                  title="Coming in a future AgentSpace release."
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#6F7485]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#6F7485]">
                    Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 bg-[#05050D]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#6F7485]">
          <AgentSpaceLogo size={16} />
          <span>AgentSpace v2.0 Platform</span>
        </div>
      </div>
    </aside>
  );
}
