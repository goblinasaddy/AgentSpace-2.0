"use client";

import Link from "next/link";
import { Search, Hammer, Play, Swords, ShieldCheck, ArrowRight } from "lucide-react";

export function CapabilitiesGrid() {
  const capabilities = [
    {
      id: "discover",
      title: "Discover",
      desc: "Find agents built by the community.",
      href: "/explore",
      cta: "Explore",
      icon: Search,
    },
    {
      id: "build",
      title: "Build",
      desc: "Create and publish your own agents.",
      href: "/build",
      cta: "Start Building",
      icon: Hammer,
    },
    {
      id: "run",
      title: "Run",
      desc: "Execute agents with your own inputs.",
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
      desc: "See verification badges and reports.",
      href: "/verification",
      cta: "Verify",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <Link
              key={cap.id}
              href={cap.href}
              className="p-5 rounded-lg bg-[#0D1118] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[#A78BFA] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{cap.title}</h3>
                  <p className="text-xs text-[#A7AFBF] font-sans mt-1 leading-relaxed">{cap.desc}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center text-xs font-sans text-[#6D5DF6] group-hover:text-[#A78BFA] transition-colors font-medium">
                <span>{cap.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
