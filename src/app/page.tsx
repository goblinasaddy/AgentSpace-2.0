import Link from "next/link";
import { Cpu, Search, Plus, Award, Terminal, FolderGit2, ShieldCheck, ArrowRight, Play } from "lucide-react";
import { prisma } from "@/infrastructure/database/client";
import { AgentCard } from "@/components/agents/AgentCard";
import { VerificationBadge } from "@/components/verification/VerificationBadge";

export const revalidate = 0;

export default async function HomePage() {
  let agents: any[] = [];
  let repositoriesCount = 0;
  let runsCount = 0;

  try {
    const [fetchedAgents, fetchedRepoCount, fetchedRunCount] = await Promise.all([
      prisma.agent.findMany({
        include: {
          repository: {
            include: {
              owner: {
                select: { username: true, displayName: true },
              },
            },
          },
          versions: {
            orderBy: { publishedAt: "desc" },
            take: 1,
          },
        },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.repository.count(),
      prisma.run.count(),
    ]);
    agents = fetchedAgents;
    repositoriesCount = fetchedRepoCount;
    runsCount = fetchedRunCount;
  } catch (err) {
    console.warn("Database offline or unreachable, rendering fallback workspace state.");
  }

  return (
    <div className="space-y-12">
      {/* Hero Orientation */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#121215] via-[#18181b] to-[#121215] border border-[#27272a] space-y-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[#c4b5fd] border border-[#8b5cf6]/30 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AgentSpace 2.0 Platform Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
            The Home for AI Agents
          </h1>
          <p className="text-sm md:text-base text-[#a1a1aa] leading-relaxed">
            Build, publish, discover, execute, evaluate, and trust AI agents with evidence-based verification and persistent database state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/explore"
            className="px-5 py-2.5 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-mono font-bold transition-all shadow-lg shadow-[#8b5cf6]/20 flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Explore Agents</span>
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-white text-xs font-mono border border-[#27272a] transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Build Agent</span>
          </Link>
          <Link
            href="/verification"
            className="px-5 py-2.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white text-xs font-mono border border-[#27272a] transition-all flex items-center space-x-2"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Trust & Verification</span>
          </Link>
        </div>
      </div>

      {/* Verified Real Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#a78bfa]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{repositoriesCount}</div>
            <div className="text-xs text-[#a1a1aa] font-mono">Public Repositories</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{agents.length}</div>
            <div className="text-xs text-[#a1a1aa] font-mono">Published Agents</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-[#27272a] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white">{runsCount}</div>
            <div className="text-xs text-[#a1a1aa] font-mono">Async Executions</div>
          </div>
        </div>
      </div>

      {/* Featured / Recently Published Agents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#8b5cf6]" /> Recently Published Agents
            </h2>
            <p className="text-xs text-[#a1a1aa]">Real agents from persistent database queries</p>
          </div>
          <Link href="/explore" className="text-xs font-mono text-[#a78bfa] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center text-xs font-mono text-[#a1a1aa]">
            No agents published yet. Create your first agent in the Workspace!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Verification Trust Spotlight */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white font-sans">Evidence-Based Verification</h2>
          </div>
          <Link href="/verification" className="text-xs font-mono text-[#a78bfa] hover:underline">
            Inspect Audit Reports →
          </Link>
        </div>
        <p className="text-xs text-[#a1a1aa]">
          AgentSpace verification ties evidence badges strictly to exact published version artifacts.
        </p>
        <div className="flex flex-wrap gap-2">
          <VerificationBadge badgeType="SECURITY_SCREENED" />
          <VerificationBadge badgeType="RELIABILITY_VERIFIED" />
          <VerificationBadge badgeType="PRIVACY_VERIFIED" />
        </div>
      </div>
    </div>
  );
}
