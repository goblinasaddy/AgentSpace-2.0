import Link from "next/link";
import { Cpu, Award, ArrowRight, ShieldCheck } from "lucide-react";
import { prisma } from "@/infrastructure/database/client";
import { SpaceBackground } from "@/components/landing/SpaceBackground";
import { Hero } from "@/components/landing/Hero";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { WhyAgentSpace } from "@/components/landing/WhyAgentSpace";
import { LifecycleOrbital } from "@/components/landing/LifecycleOrbital";
import { CommunitySection } from "@/components/landing/CommunitySection";
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
  } catch {
    console.warn("Database offline or unreachable, rendering fallback workspace state.");
  }

  return (
    <div className="relative min-h-screen space-y-16 pb-20">
      {/* Background Starfield & Light Atmosphere */}
      <SpaceBackground />

      {/* Main Landing Hero */}
      <Hero />

      {/* Real Statistics Metrics Strip */}
      <MetricsStrip
        repositoriesCount={repositoriesCount}
        agentsCount={agents.length > 0 ? agents.length : 0}
        runsCount={runsCount}
      />

      {/* Why AgentSpace Header */}
      <WhyAgentSpace />

      {/* 5-Node Orbital Lifecycle Flow */}
      <LifecycleOrbital />

      {/* Featured / Recently Published Agents Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#8B5CF6]" /> Recently Published Agents
            </h2>
            <p className="text-xs text-[#6F7485] font-mono mt-0.5">
              Live agents retrieved directly from persistent database records
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-mono text-[#A78BFA] hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0D101A] border border-white/10 text-center text-xs font-mono text-[#6F7485]">
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

      {/* Evidence-Based Verification Trust Spotlight */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="p-8 rounded-2xl bg-[#0D101A] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-sans">Evidence-Based Verification</h2>
                <p className="text-xs text-[#6F7485] font-mono">
                  Cryptographically tied to exact commit SHA & published artifact logs
                </p>
              </div>
            </div>
            <Link href="/verification" className="text-xs font-mono text-[#A78BFA] hover:underline">
              Inspect Verification Reports →
            </Link>
          </div>

          <p className="text-xs text-[#A8ADBD] leading-relaxed max-w-3xl font-sans">
            Every badge on AgentSpace requires reproducible evidence. Verification passes analyze static code security, execution deterministic stability, and private sandbox isolation before awarding trust marks.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <VerificationBadge badgeType="SECURITY_SCREENED" />
            <VerificationBadge badgeType="RELIABILITY_VERIFIED" />
            <VerificationBadge badgeType="PRIVACY_VERIFIED" />
          </div>
        </div>
      </div>

      {/* Community Call to Action */}
      <CommunitySection />
    </div>
  );
}
