import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/infrastructure/database/client";
import { Hero } from "@/components/landing/Hero";
import { MetricsStrip } from "@/components/landing/MetricsStrip";
import { WhyAgentSpace } from "@/components/landing/WhyAgentSpace";
import { CapabilitiesGrid } from "@/components/landing/CapabilitiesGrid";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { AgentCard } from "@/components/agents/AgentCard";
import { EmptyState } from "@/components/ui/EmptyState";

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
        take: 3,
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
    <div className="relative min-h-screen space-y-16 pb-16 font-sans">
      {/* Landing Hero */}
      <Hero />

      {/* Real Statistics Metrics */}
      <MetricsStrip
        repositoriesCount={repositoriesCount}
        agentsCount={agents.length > 0 ? agents.length : 0}
        runsCount={runsCount}
      />

      {/* Featured Agents Grid */}
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Featured Agents
          </h2>
          <Link
            href="/explore"
            className="text-xs font-medium text-[#6D5DF6] hover:text-[#A78BFA] transition-colors flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {agents.length === 0 ? (
          <EmptyState
            title="No agents yet."
            description="Be one of the first builders on AgentSpace."
            actionLabel="Build an Agent"
            actionHref="/build"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Core Capabilities Section */}
      <WhyAgentSpace />
      <CapabilitiesGrid />

      {/* Community Section */}
      <CommunitySection />
    </div>
  );
}
