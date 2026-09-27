"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 text-center space-y-8 z-10 max-w-4xl mx-auto px-4 font-sans">
      {/* Main Brand Title & Subtitle */}
      <div className="space-y-4">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white">
          Agent<span className="text-[#6D5DF6]">Space</span>
        </h1>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          The home for AI agents.
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#A7AFBF] leading-relaxed">
          Build, publish, discover and improve agents built by developers.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-md bg-[#6D5DF6] hover:bg-[#5C4CE5] text-white text-xs font-semibold transition-all shadow-md shadow-[#6D5DF6]/25 flex items-center space-x-2 group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 rounded-md bg-[#0D1118] hover:bg-[#111722] text-[#F5F7FA] text-xs font-medium border border-white/10 hover:border-white/20 transition-all"
        >
          Explore Agents
        </Link>
      </div>
    </div>
  );
}
