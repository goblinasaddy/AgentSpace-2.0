import Link from "next/link";
import { notFound } from "next/navigation";
import { FolderGit2, Cpu, GitFork, Star, MessageSquare, GitPullRequest, ShieldCheck } from "lucide-react";
import { prisma } from "@/infrastructure/database/client";
import { AgentCard } from "@/components/agents/AgentCard";

export const revalidate = 0;

export default async function RepositoryOverviewPage({
  params,
}: {
  params: Promise<{ owner: string; slug: string }>;
}) {
  const { owner, slug } = await params;

  // Find user by username
  const user = await prisma.user.findUnique({
    where: { username: owner },
  });

  if (!user) {
    notFound();
  }

  // Find repo by ownerId and slug
  const repo = await prisma.repository.findUnique({
    where: {
      ownerId_slug: {
        ownerId: user.id,
        slug,
      },
    },
    include: {
      owner: {
        select: { id: true, username: true, displayName: true },
      },
      agents: {
        include: {
          versions: {
            orderBy: { publishedAt: "desc" },
            take: 1,
          },
        },
      },
      issues: {
        include: {
          author: { select: { username: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      pullRequests: {
        include: {
          author: { select: { username: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      stars: true,
    },
  });

  if (!repo) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Repository Header */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#a78bfa]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white font-mono">
                  {repo.owner.username} / {repo.slug}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#a78bfa] border border-[#8b5cf6]/30">
                  {repo.visibility}
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] font-mono">{repo.description || "No description provided."}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-mono text-white">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{repo.stars.length} Stars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agents in Repository */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#8b5cf6]" /> Agents in Repository ({repo.agents.length})
        </h2>

        {repo.agents.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#121215] border border-[#27272a] text-center text-xs font-mono text-[#a1a1aa]">
            No agents in this repository yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repo.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>

      {/* Collaboration: Issues & PRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues Box */}
        <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8b5cf6]" /> Issues ({repo.issues.length})
          </h3>
          <div className="space-y-2">
            {repo.issues.length === 0 ? (
              <div className="text-xs text-[#71717a] font-mono">No open issues.</div>
            ) : (
              repo.issues.map((iss) => (
                <div key={iss.id} className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg text-xs font-mono flex items-center justify-between">
                  <span className="text-white font-bold">
                    #{iss.number} {iss.title}
                  </span>
                  <span className="text-amber-400">{iss.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pull Requests Box */}
        <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-[#8b5cf6]" /> Pull Requests ({repo.pullRequests.length})
          </h3>
          <div className="space-y-2">
            {repo.pullRequests.length === 0 ? (
              <div className="text-xs text-[#71717a] font-mono">No open pull requests.</div>
            ) : (
              repo.pullRequests.map((pr) => (
                <div key={pr.id} className="p-3 bg-[#09090b] border border-[#27272a] rounded-lg text-xs font-mono flex items-center justify-between">
                  <span className="text-white font-bold">
                    #{pr.number} {pr.title}
                  </span>
                  <span className="text-emerald-400">{pr.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
