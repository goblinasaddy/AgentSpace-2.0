"use client";

import { FolderGit2, Cpu, Terminal } from "lucide-react";

interface MetricsStripProps {
  repositoriesCount: number;
  agentsCount: number;
  runsCount: number;
}

export function MetricsStrip({
  repositoriesCount,
  agentsCount,
  runsCount,
}: MetricsStripProps) {
  return (
    <div className="relative z-10 py-8 max-w-5xl mx-auto px-4">
      <div className="p-6 md:p-8 rounded-2xl bg-[#0D101A]/80 border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="flex items-center space-x-4 sm:pr-4 pt-2 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-[#4D9CFF]/10 border border-[#4D9CFF]/20 flex items-center justify-center text-[#4D9CFF]">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {repositoriesCount}
              </div>
              <div className="text-xs text-[#A8ADBD] font-mono mt-0.5">Public Repositories</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:px-6 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {agentsCount}
              </div>
              <div className="text-xs text-[#A8ADBD] font-mono mt-0.5">Published Agents</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 sm:pl-6 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-[#D946EF]/10 border border-[#D946EF]/20 flex items-center justify-center text-[#D946EF]">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {runsCount}
              </div>
              <div className="text-xs text-[#A8ADBD] font-mono mt-0.5">Async Executions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
