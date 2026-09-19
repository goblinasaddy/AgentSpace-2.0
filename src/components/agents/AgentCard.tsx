"use client";

import Link from "next/link";
import { Cpu, Star, GitFork, Play } from "lucide-react";
import { VerificationBadge } from "../verification/VerificationBadge";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description?: string;
    type?: string;
    versions?: any[];
    repository?: {
      slug: string;
      owner?: {
        username: string;
      };
    };
  };
}

export function AgentCard({ agent }: AgentCardProps) {
  const latestVersion = agent.versions && agent.versions.length > 0 ? agent.versions[0].version : "1.0.0";
  const repoOwner = agent.repository?.owner?.username || "developer";
  const repoSlug = agent.repository?.slug || "agent-repo";

  return (
    <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] hover:border-[#8b5cf6]/40 transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#a78bfa] group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <Link
                href={`/agents/${agent.id}`}
                className="font-mono text-sm font-bold text-white hover:text-[#c4b5fd] transition-colors"
              >
                {agent.name}
              </Link>
              <div className="text-[11px] font-mono text-[#71717a]">
                by {repoOwner}/{repoSlug}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
            v{latestVersion}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
          {agent.description || "Autonomous developer agent built for AgentSpace ecosystem."}
        </p>
      </div>

      {/* Footer & Badges */}
      <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <VerificationBadge badgeType="SECURITY_SCREENED" size="sm" />
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/agents/${agent.id}/run`}
            className="px-2.5 py-1 rounded bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 text-[#c4b5fd] border border-[#8b5cf6]/30 text-xs font-mono font-medium flex items-center space-x-1 transition-all"
          >
            <Play className="w-3 h-3 fill-[#c4b5fd]" />
            <span>Run</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
