import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, Award, FileText, CheckCircle2, ArrowLeft, Terminal } from "lucide-react";
import { getVerificationReport } from "@/modules/verification/service";
import { VerificationBadge } from "@/components/verification/VerificationBadge";

export const revalidate = 0;

export default async function VerificationReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: agentVersionId } = await params;
  const report = await getVerificationReport(agentVersionId);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link href="/verification" className="text-xs font-mono text-[#a78bfa] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Verification Center</span>
        </Link>
        <span className="text-xs font-mono text-[#71717a]">Report ID: {report.id}</span>
      </div>

      {/* Main Report Document Container */}
      <div className="p-8 rounded-2xl bg-[#121215] border border-[#27272a] space-y-6">
        {/* Title Header */}
        <div className="border-b border-[#27272a] pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" /> Technical Verification Audit Report
            </h1>
            <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold uppercase">
              STATUS: PASSED
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] font-mono">Issued on {new Date(report.issuedAt).toLocaleDateString()}</p>
        </div>

        {/* 1. Artifact & Version Binding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#09090b] rounded-lg border border-[#27272a] space-y-1">
            <span className="text-[#71717a] uppercase text-[10px]">Target AgentVersion ID</span>
            <div className="text-white font-bold">{report.agentVersionId}</div>
          </div>
          <div className="p-3 bg-[#09090b] rounded-lg border border-[#27272a] space-y-1">
            <span className="text-[#71717a] uppercase text-[10px]">Attested Badge</span>
            <div>
              <VerificationBadge badgeType="SECURITY_SCREENED" size="sm" />
            </div>
          </div>
        </div>

        {/* 2. Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Executive Summary</h2>
          <p className="text-xs text-[#a1a1aa] leading-relaxed font-mono p-4 bg-[#09090b] rounded-lg border border-[#27272a]">
            {report.summary}
          </p>
        </div>

        {/* 3. Methodology & Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-white uppercase">Methodology Standard</h3>
            <div className="p-3 bg-[#09090b] rounded-lg border border-[#27272a] text-[#a1a1aa]">
              AgentSpace Security Screening v1.0.0 (Automated Input Sanitization & Secret Exposure Analysis)
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-[11px] font-bold text-white uppercase">Screening Environment</h3>
            <div className="p-3 bg-[#09090b] rounded-lg border border-[#27272a] text-[#a1a1aa]">
              AgentSpace Isolated Execution Sandbox v1 (30s Timeout Limit)
            </div>
          </div>
        </div>

        {/* 4. Automated Tests & Evidence Data */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#8b5cf6]" /> Evidence Data & Test Telemetry
          </h2>
          <pre className="p-4 bg-[#09090b] rounded-lg border border-[#27272a] font-mono text-xs text-emerald-400 overflow-auto max-h-60">
            {JSON.stringify(report.evidenceData, null, 2)}
          </pre>
        </div>

        {/* 5. Audit Limitations */}
        <div className="space-y-2 pt-2 border-t border-[#27272a]">
          <h2 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">Verification Limitations</h2>
          <p className="text-xs text-[#a1a1aa] font-mono leading-relaxed p-3 bg-[#09090b] rounded-lg border border-[#27272a]">
            {report.limitations}
          </p>
        </div>
      </div>
    </div>
  );
}
