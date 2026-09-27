"use client";

import Link from "next/link";
import { Cpu, Star, Play, CheckCircle2 } from "lucide-react";

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    description?: string | null;
    type?: string;
    stars?: number;
    runsCount?: number;
    tags?: string[];
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
  const latestVersion =
    agent.versions && agent.versions.length > 0 ? agent.versions[0].version : "1.4.2";
  const repoOwner = agent.repository?.owner?.username || "developer";
  const stars = agent.stars ?? 128;
  const runs = agent.runsCount ? `${(agent.runsCount / 1000).toFixed(1)}k` : "3.4k";
  const tags = agent.tags || ["research", "web", "productivity"];

  return (
    <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between space-y-4 group font-sans">
      <div className="space-y-3">
        {/* Header: Icon, Name & Verified Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#6D5DF6]/15 border border-[#6D5DF6]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <Link
                href={`/agents/${agent.id}`}
                className="text-sm font-bold text-white hover:text-[#A78BFA] transition-colors"
              >
                {agent.name}
              </Link>
              <div className="text-[11px] text-[#6F788A] mt-0.5">
                @{repoOwner}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 text-[10px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#A7AFBF] line-clamp-2 leading-relaxed">
          {agent.description || "Research agent for finding and summarizing information from the web."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-[#A7AFBF]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#6F788A]">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 hover:text-white transition-colors">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white text-[11px] font-medium">{stars}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Play className="w-3 h-3 text-[#6D5DF6]" />
            <span className="text-[11px]">{runs}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#6F788A]">v{latestVersion}</span>
        </div>
      </div>
    </div>
  );
}
