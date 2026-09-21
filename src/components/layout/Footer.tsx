"use client";

import Link from "next/link";
import { AgentSpaceLogo } from "@/components/brand/AgentSpaceLogo";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#05050D]/80 backdrop-blur-md text-[#6F7485] text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <AgentSpaceLogo size={24} />
            <span className="font-sans font-bold text-white text-sm tracking-tight">AgentSpace</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-[#A8ADBD]">
            <Link href="/explore" className="hover:text-white transition-colors">Discover</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Build</Link>
            <Link href="/battle" className="hover:text-white transition-colors">Evaluate</Link>
            <Link href="/verification" className="hover:text-white transition-colors">Trust & Verification</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <p>© {new Date().getFullYear()} AgentSpace. All rights reserved.</p>
          <p className="text-[#6F7485]">An open digital ecosystem for autonomous AI agents.</p>
        </div>
      </div>
    </footer>
  );
}
