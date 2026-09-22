"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CommunitySection() {
  return (
    <div className="relative z-10 py-16 max-w-3xl mx-auto px-4 text-center space-y-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
        More agents. A more open future.
      </h2>

      <p className="max-w-xl mx-auto text-sm text-[#A8ADBD] leading-relaxed font-sans">
        Join developers building transparent, reliable, and verifiable AI agents.
      </p>

      <div className="pt-2">
        <Link
          href="/explore"
          className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-sans text-xs font-bold transition-all shadow-lg shadow-[#8B5CF6]/20 group"
        >
          <span>Join the Community</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
