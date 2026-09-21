"use client";

import { Compass, Hammer, Play, Swords, ShieldCheck } from "lucide-react";

export function LifecycleOrbital() {
  const steps = [
    {
      id: "discover",
      title: "Discover",
      desc: "Find powerful agents built by the community.",
      icon: Compass,
      color: "#4D9CFF",
    },
    {
      id: "build",
      title: "Build",
      desc: "Create and customize agents.",
      icon: Hammer,
      color: "#8B5CF6",
    },
    {
      id: "run",
      title: "Run",
      desc: "Execute agents in real environments.",
      icon: Play,
      color: "#D946EF",
    },
    {
      id: "evaluate",
      title: "Evaluate",
      desc: "Compare, test and improve.",
      icon: Swords,
      color: "#FFB84D",
    },
    {
      id: "trust",
      title: "Trust",
      desc: "Verify with evidence.",
      icon: ShieldCheck,
      color: "#34D399",
    },
  ];

  return (
    <div className="relative z-10 py-12 max-w-6xl mx-auto px-4">
      {/* Orbital Flow Line Container */}
      <div className="relative">
        {/* Horizontal Curved Orbital SVG Line for Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-20 pointer-events-none">
          <svg viewBox="0 0 1000 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M 50 40 Q 250 10, 500 40 T 950 40"
              stroke="url(#orbitalGradient)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <defs>
              <linearGradient id="orbitalGradient" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4D9CFF" />
                <stop offset="0.25" stopColor="#8B5CF6" />
                <stop offset="0.5" stopColor="#D946EF" />
                <stop offset="0.75" stopColor="#FFB84D" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-5 rounded-2xl bg-[#0D101A] border border-white/10 hover:border-white/20 transition-all space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${step.color}15`,
                        borderColor: `${step.color}30`,
                        borderWidth: "1px",
                        color: step.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#6F7485]">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white font-sans tracking-tight">{step.title}</h3>
                    <p className="text-xs text-[#A8ADBD] font-sans mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                <div className="h-0.5 w-full rounded-full opacity-40" style={{ backgroundColor: step.color }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
