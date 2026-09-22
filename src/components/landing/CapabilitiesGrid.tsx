"use client";

import Link from "next/link";
import { Search, Hammer, Play, Swords, ShieldCheck, ArrowUpRight } from "lucide-react";

export function CapabilitiesGrid() {
  const capabilities = [
    {
      id: "discover",
      title: "Discover",
      desc: "Explore agents created by the community.",
      href: "/explore",
      cta: "Explore",
      icon: Search,
    },
    {
      id: "build",
      title: "Build",
      desc: "Create and customize your own agent.",
      href: "/dashboard",
      cta: "Start Building",
      icon: Hammer,
    },
    {
      id: "run",
      title: "Run",
      desc: "Run agents in a real execution environment.",
      href: "/explore",
      cta: "Run an Agent",
      icon: Play,
    },
    {
      id: "evaluate",
      title: "Evaluate",
      desc: "Compare agents and analyze behavior.",
      href: "/battle",
      cta: "Compare",
      icon: Swords,
    },
    {
      id: "trust",
      title: "Trust",
      desc: "Verify agents with evidence.",
      href: "/verification",
      cta: "Verify",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative z-10 py-6 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <Link
              key={cap.id}
              href={cap.href}
              className="p-5 rounded-2xl bg-[#0D101A] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-4 group shadow-md"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A78BFA] group-hover:text-white transition-colors">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{cap.title}</h3>
                  <p className="text-xs text-[#A8ADBD] font-sans mt-1 leading-relaxed">{cap.desc}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center text-xs font-sans text-[#8B5CF6] group-hover:text-[#A78BFA] transition-colors font-medium">
                <span>{cap.cta}</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
