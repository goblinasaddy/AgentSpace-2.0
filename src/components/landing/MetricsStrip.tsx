"use client";

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
  // If zero data across all metrics, omit the strip cleanly
  if (repositoriesCount === 0 && agentsCount === 0 && runsCount === 0) {
    return null;
  }

  return (
    <div className="relative z-10 py-4 max-w-3xl mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 border-y border-white/5 py-4 text-center font-sans">
        <div>
          <span className="text-xl font-bold text-white tracking-tight">{repositoriesCount}</span>
          <span className="text-xs text-[#6F7485] ml-2">Repositories</span>
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight">{agentsCount}</span>
          <span className="text-xs text-[#6F7485] ml-2">Agents</span>
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight">{runsCount}</span>
          <span className="text-xs text-[#6F7485] ml-2">Runs</span>
        </div>
      </div>
    </div>
  );
}
