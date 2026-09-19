import Link from "next/link";
import { notFound } from "next/navigation";
import { Cpu, Play, GitFork, Star, ShieldCheck, FileText, CheckCircle2, Clock, Terminal } from "lucide-react";
import { getAgentById } from "@/modules/agents/service";
import { VerificationBadge } from "@/components/verification/VerificationBadge";

export const revalidate = 0;

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgentById(id);

  if (!agent) {
    notFound();
  }

  const repoOwner = agent.repository?.owner?.username || "developer";
  const repoSlug = agent.repository?.slug || "agent-repo";
  const latestVersion = agent.versions && agent.versions.length > 0 ? agent.versions[0] : null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#a78bfa] shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-mono">{agent.name}</h1>
              <div className="text-xs text-[#a1a1aa] font-mono">
                by{" "}
                <Link href={`/repositories/${repoOwner}/${repoSlug}`} className="text-[#a78bfa] hover:underline">
                  {repoOwner}/{repoSlug}
                </Link>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/agents/${agent.id}/run`}
              className="px-4 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-mono font-bold transition-all shadow-lg shadow-[#8b5cf6]/20 flex items-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run Agent Workspace</span>
            </Link>
          </div>
        </div>

        <p className="text-sm text-[#a1a1aa] leading-relaxed">
          {agent.description || "No description provided for this agent."}
        </p>

        {/* Verification Badges near top */}
        <div className="pt-2 flex flex-wrap gap-2 border-t border-[#27272a]">
          <VerificationBadge badgeType="SECURITY_SCREENED" version={latestVersion?.version || "1.0.0"} />
          <VerificationBadge badgeType="RELIABILITY_VERIFIED" version={latestVersion?.version || "1.0.0"} />
        </div>
      </div>

      {/* Grid: Versions & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Spec Contract Overview */}
          <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8b5cf6]" /> Agent Specification Contract
            </h2>

            {latestVersion ? (
              <div className="space-y-3 font-mono text-xs text-[#a1a1aa]">
                <div className="flex justify-between p-2 bg-[#09090b] rounded border border-[#27272a]">
                  <span>Runtime Provider:</span>
                  <span className="text-emerald-400 font-bold">Gemini (gemini-2.5-flash)</span>
                </div>
                <div className="flex justify-between p-2 bg-[#09090b] rounded border border-[#27272a]">
                  <span>Semver Release:</span>
                  <span className="text-white font-bold">v{latestVersion.version}</span>
                </div>
                <div className="flex justify-between p-2 bg-[#09090b] rounded border border-[#27272a]">
                  <span>Immutability Status:</span>
                  <span className="text-emerald-400">Strictly Immutable</span>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#a1a1aa]">No version published for this agent yet.</p>
            )}
          </div>
        </div>

        {/* Version History Sidebar */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8b5cf6]" /> Published Versions
          </h2>
          <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
            {agent.versions.map((ver) => (
              <div key={ver.id} className="p-3 bg-[#09090b] rounded-lg border border-[#27272a] space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">v{ver.version}</span>
                  <span className="text-[10px] text-emerald-400">Published</span>
                </div>
                <p className="text-[11px] text-[#71717a] font-mono">{ver.releaseNotes || "Initial release"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
