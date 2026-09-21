"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

export function CommunitySection() {
  return (
    <div className="relative z-10 py-20 max-w-4xl mx-auto px-4 text-center space-y-6">
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#4D9CFF]">
        <Users className="w-3.5 h-3.5" />
        <span>Open Ecosystem & Community</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
        More agents. A more open future.
      </h2>

      <p className="max-w-xl mx-auto text-sm text-[#A8ADBD] leading-relaxed font-sans">
        Join developers building transparent, reliable, and verifiable AI agents. Share code, evaluate performance, and collaborate openly.
      </p>

      <div className="pt-2">
        <Link
          href="/explore"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#4D9CFF] hover:from-[#7C3AED] hover:to-[#3B82F6] text-white font-sans text-xs font-bold transition-all shadow-xl shadow-[#8B5CF6]/20 group"
        >
          <span>Join the Community</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
