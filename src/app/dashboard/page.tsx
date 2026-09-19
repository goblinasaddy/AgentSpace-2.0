import Link from "next/link";
import { LayoutDashboard, FolderGit2, Cpu } from "lucide-react";
import { prisma } from "@/infrastructure/database/client";
import { AgentCard } from "@/components/agents/AgentCard";

export const revalidate = 0;

export default async function DashboardPage() {
  let repositories: any[] = [];
  let agents: any[] = [];
  let runs: any[] = [];

  try {
    const [fetchedRepos, fetchedAgents, fetchedRuns] = await Promise.all([
      prisma.repository.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          owner: { select: { username: true, displayName: true } },
        },
      }),
      prisma.agent.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          repository: {
            include: { owner: { select: { username: true } } },
          },
          versions: { take: 1, orderBy: { publishedAt: "desc" } },
        },
      }),
      prisma.run.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    repositories = fetchedRepos;
    agents = fetchedAgents;
    runs = fetchedRuns;
  } catch (err) {
    console.warn("Database offline or unreachable, rendering fallback dashboard state.");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[#8b5cf6]" /> Developer Workspace & Dashboard
        </h1>
        <p className="text-xs text-[#a1a1aa] font-mono">
          Manage your published agents, repositories, and active execution runs.
        </p>
      </div>

      {/* Repositories List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#8b5cf6]" /> Recent Repositories ({repositories.length})
          </h2>
        </div>

        <div className="space-y-3">
          {repositories.length === 0 ? (
            <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl text-center text-xs font-mono text-[#a1a1aa]">
              No repositories found. Create your first repository!
            </div>
          ) : (
            repositories.map((repo) => (
              <div key={repo.id} className="p-4 rounded-xl bg-[#121215] border border-[#27272a] flex items-center justify-between">
                <div>
                  <Link
                    href={`/repositories/${repo.owner?.username || "dev"}/${repo.slug}`}
                    className="text-sm font-mono font-bold text-white hover:text-[#c4b5fd]"
                  >
                    {repo.owner?.username || "dev"}/{repo.slug}
                  </Link>
                  <p className="text-xs text-[#a1a1aa] font-mono">{repo.description || "No description."}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a78bfa]">
                  {repo.visibility}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Agents Grid Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#8b5cf6]" /> Active Published Agents
        </h2>
        {agents.length === 0 ? (
          <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl text-center text-xs font-mono text-[#a1a1aa]">
            No published agents found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
