"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <div className="relative pt-32 pb-24 md:pt-40 md:pb-36 text-center space-y-8 z-10 max-w-5xl mx-auto px-4">
      {/* Subtle Corner Text - Left */}
      <div className="hidden lg:block absolute left-[-40px] top-[180px] text-left font-mono text-[10px] tracking-[0.25em] text-[#6F7485] leading-relaxed select-none opacity-60">
        <p>MORE</p>
        <p>AGENTS</p>
        <p>A BRIGHTER</p>
        <p>TOMORROW</p>
      </div>

      {/* Subtle Corner Text - Right */}
      <div className="hidden lg:block absolute right-[-40px] top-[180px] text-right font-mono text-[10px] tracking-[0.25em] text-[#6F7485] leading-relaxed select-none opacity-60">
        <p>IDEAS</p>
        <p>BUILD</p>
        <p>COLLABORATE</p>
        <p>BELONG</p>
      </div>

      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#A78BFA] transition-all">
        <Sparkles className="w-3.5 h-3.5 text-[#4D9CFF]" />
        <span>An Open Ecosystem for Autonomous AI Agents</span>
      </div>

      {/* Giant Main Brand Heading */}
      <div className="space-y-4">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white font-sans">
          Agent<span className="text-[#8B5CF6]">Space</span>
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#A8ADBD] font-sans">
          Build. Share. Explore. Evolve.
        </h2>
      </div>

      {/* Subheading */}
      <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#6F7485] leading-relaxed font-sans">
        An open ecosystem for AI agents — built by developers, for a more capable tomorrow.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/dashboard"
          className="px-7 py-3.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-sans text-xs font-bold transition-all shadow-xl shadow-[#8B5CF6]/25 flex items-center space-x-2 group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/explore"
          className="px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-sans text-xs font-medium border border-white/10 transition-all"
        >
          Explore Agents
        </Link>
      </div>
    </div>
  );
}
