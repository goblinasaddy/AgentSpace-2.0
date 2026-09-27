"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function VerificationReportPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-[#6F788A]">
        <Link href="/verification" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Verification</span>
        </Link>
        <span>&gt;</span>
        <span className="text-white font-medium">{id} Report</span>
      </div>

      {/* Report Document Container */}
      <div className="p-8 rounded-xl bg-[#0D1118] border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Verification Report</h1>
            <p className="text-xs text-[#6F788A]">Artifact: <span className="text-white font-mono">{id}</span> · Version: <span className="text-white font-mono">v1.4.2</span></p>
          </div>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed</span>
          </span>
        </div>

        {/* Technical Sections */}
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">Verification Status</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 font-medium">
                Security Screened
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#4D8DFF]/15 text-[#4D8DFF] border border-[#4D8DFF]/30 font-medium">
                Reliability Verified
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#A78BFA]/15 text-[#A78BFA] border border-[#A78BFA]/30 font-medium">
                Privacy Verified
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <h2 className="text-sm font-bold text-white">Methodology</h2>
            <p className="text-[#A7AFBF] leading-relaxed">
              Static code analysis, deterministic sandbox execution, and data flow boundary inspection were performed against the target build artifact.
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <h2 className="text-sm font-bold text-white">Environment & Artifact Reference</h2>
            <pre className="p-3.5 rounded-lg bg-[#05070B] border border-white/5 font-mono text-[11px] text-[#A7AFBF]">
              Commit SHA: a8f4e2b9c71d3e8f45a019b
              Sandbox Isolation: Level 2 Managed Runtime
              Evaluated At: 2026-09-22T08:14:00Z
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
