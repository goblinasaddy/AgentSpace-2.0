import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/infrastructure/database/client";
import { SpaceBackground } from "@/components/landing/SpaceBackground";
import { Hero } from "@/components/landing/Hero";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { WhyAgentSpace } from "@/components/landing/WhyAgentSpace";
import { CapabilitiesGrid } from "@/components/landing/CapabilitiesGrid";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { AgentCard } from "@/components/agents/AgentCard";

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
    // Quiet fallback
  }

  return (
    <div className="relative min-h-screen space-y-16 pb-20">
      {/* Background Starfield & Atmosphere */}
      <SpaceBackground />

      {/* Landing Hero */}
      <Hero />

      {/* Real Statistics Metrics */}
      <MetricsStrip
        repositoriesCount={repositoriesCount}
        agentsCount={agents.length > 0 ? agents.length : 0}
        runsCount={runsCount}
      />

      {/* Capabilities Section Header */}
      <WhyAgentSpace />

      {/* 5 Independent Capabilities (No Pipeline / No Arrows) */}
      <CapabilitiesGrid />

      {/* Featured Agents */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">
            Featured Agents
          </h2>
          <Link
            href="/explore"
            className="text-xs font-sans text-[#8B5CF6] hover:text-[#A78BFA] transition-colors flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {agents.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#0D101A] border border-white/10 text-center space-y-3">
            <p className="text-sm font-sans text-white font-medium">No agents yet.</p>
            <p className="text-xs font-sans text-[#A8ADBD]">Be one of the first builders on AgentSpace.</p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-sans text-xs font-bold transition-all"
              >
                <span>Build an Agent</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Community Section */}
      <CommunitySection />
    </div>
  );
}
