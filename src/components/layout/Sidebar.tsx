"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, FolderGit2, Swords, Award, LayoutDashboard, Users } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: "DISCOVER",
      items: [{ label: "Explore Agents", href: "/explore", icon: Search }],
    },
    {
      title: "BUILD",
      items: [
        { label: "Workspace", href: "/dashboard", icon: LayoutDashboard },
        { label: "Repositories", href: "/dashboard", icon: FolderGit2 },
      ],
    },
    {
      title: "EVALUATE",
      items: [{ label: "Battle Arena", href: "/battle", icon: Swords }],
    },
    {
      title: "TRUST",
      items: [{ label: "Verification", href: "/verification", icon: Award }],
    },
    {
      title: "COMMUNITY",
      items: [{ label: "Community", href: "/community", icon: Users }],
    },
  ];

  return (
    <aside className="w-56 border-r border-white/10 bg-[#05050D] flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-4 space-y-6">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            <div className="px-3 mb-1 text-[10px] font-sans font-bold tracking-wider uppercase text-[#6F7485]">
              {sec.title}
            </div>
            <nav className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-sans transition-all ${
                      isActive
                        ? "bg-[#8B5CF6]/15 text-white font-bold border border-[#8B5CF6]/30"
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
        ))}
      </div>
    </aside>
  );
}
