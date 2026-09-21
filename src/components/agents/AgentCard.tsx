"use client";

import Link from "next/link";
import { Cpu, Play } from "lucide-react";
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
    <div className="p-5 rounded-2xl bg-[#0D101A] border border-white/10 hover:border-[#8B5CF6]/50 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-xl">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA] group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <Link
                href={`/agents/${agent.id}`}
                className="font-mono text-sm font-bold text-white hover:text-[#A78BFA] transition-colors"
              >
                {agent.name}
              </Link>
              <div className="text-[11px] font-mono text-[#6F7485]">
                by {repoOwner}/{repoSlug}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A8ADBD]">
            v{latestVersion}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#A8ADBD] line-clamp-2 leading-relaxed">
          {agent.description || "Autonomous developer agent built for AgentSpace ecosystem."}
        </p>
      </div>

      {/* Footer & Badges */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <VerificationBadge badgeType="SECURITY_SCREENED" size="sm" />
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/agents/${agent.id}/run`}
            className="px-3 py-1 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#A78BFA] border border-[#8B5CF6]/30 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all"
          >
            <Play className="w-3 h-3 fill-[#A78BFA]" />
            <span>Run</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
