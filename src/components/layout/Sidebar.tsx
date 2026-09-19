"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  FolderGit2,
  Play,
  Swords,
  Award,
  LayoutDashboard,
  Cpu,
  Layers,
  Wrench,
  Terminal,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore Agents", href: "/explore", icon: Search },
    { label: "Repositories", href: "/dashboard", icon: FolderGit2 },
    { label: "Battle Mode", href: "/battle", icon: Swords },
    { label: "Verification Center", href: "/verification", icon: Award },
    { label: "My Workspace", href: "/dashboard", icon: LayoutDashboard },
  ];

  const upcomingCategories = [
    { label: "Tools Marketplace", icon: Wrench },
    { label: "Skills Ecosystem", icon: Layers },
    { label: "MCP Servers", icon: Terminal },
  ];

  return (
    <aside className="w-60 border-r border-[#27272a] bg-[#09090b] flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-3 space-y-6">
        {/* Platform Nav */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#71717a]">
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
                      ? "bg-[#8b5cf6]/10 text-[#c4b5fd] border border-[#8b5cf6]/30 font-bold"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#121215]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#8b5cf6]" : "text-[#71717a]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Future Product Scope Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#71717a]">
            Upcoming Ecosystem Modules
          </div>
          <div className="space-y-1">
            {upcomingCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-[#52525b] cursor-not-allowed"
                  title="Coming in a future AgentSpace release."
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 text-[#3f3f46]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#52525b]">
                    Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#27272a] bg-[#09090b]">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#71717a]">
          <Cpu className="w-3.5 h-3.5 text-[#8b5cf6]" />
          <span>AgentSpace v2.0 Sandbox</span>
        </div>
      </div>
    </aside>
  );
}
