"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Folder,
  FileText,
  Star,
  GitFork,
  BookOpen,
} from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function RepositoryPage() {
  const params = useParams();
  const owner = params.owner as string;
  const slug = params.slug as string;

  const [activeTab, setActiveTab] = useState("code");
  const [repo, setRepo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRepository();
  }, [owner, slug]);

  const fetchRepository = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/v1/repositories`);
      const data = await res.json();
      if (res.ok && data.data) {
        const found = data.data.find(
          (r: any) =>
            r.slug.toLowerCase() === slug.toLowerCase() &&
            (r.owner?.username.toLowerCase() === owner.toLowerCase() || owner === "developer")
        );
        setRepo(found || data.data[0]);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "code", label: "Code" },
    { id: "agents", label: "Agents", count: repo?.agents?.length || 1 },
    { id: "issues", label: "Issues", count: 0 },
    { id: "pulls", label: "Pull Requests", count: 0 },
    { id: "discussions", label: "Discussions" },
    { id: "activity", label: "Activity" },
  ];

  const files = [
    { name: "src/", type: "folder", commit: "Add web search tool", time: "2 weeks ago" },
    { name: "agent/", type: "folder", commit: "Update agent spec", time: "3 weeks ago" },
    { name: "docs/", type: "folder", commit: "Improve documentation", time: "1 month ago" },
    { name: "examples/", type: "folder", commit: "Add example notebooks", time: "1 month ago" },
    { name: "README.md", type: "file", commit: "Update README", time: "1 month ago" },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !repo) {
    return (
      <ErrorState
        title="Repository not found."
        description="We couldn't load the requested repository."
        onRetry={() => fetchRepository()}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-[#A7AFBF]">{owner}</span>
            <span className="text-[#6F788A]">\</span>
            <span className="text-xl font-bold text-white tracking-tight">{slug}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#A7AFBF]">
              Public
            </span>
          </div>
          <p className="text-xs text-[#6F788A]">
            {repo.description || "Research agent for deep web research and summarization."}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Star 128</span>
          </Button>
          <Button variant="secondary" size="sm">
            <GitFork className="w-3.5 h-3.5" />
            <span>Fork 34</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Code & Files Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left File Tree */}
        <div className="lg:col-span-1 rounded-xl bg-[#0D1118] border border-white/10 overflow-hidden text-xs">
          <div className="p-3 bg-[#111722] border-b border-white/10 text-[#6F788A] font-mono text-[11px] flex items-center justify-between">
            <span>Files</span>
            <span>main</span>
          </div>

          <div className="divide-y divide-white/5">
            {files.map((f) => (
              <div
                key={f.name}
                className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2 font-mono text-white">
                  {f.type === "folder" ? (
                    <Folder className="w-4 h-4 text-[#6D5DF6]" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#A7AFBF]" />
                  )}
                  <span>{f.name}</span>
                </div>
                <span className="text-[10px] text-[#6F788A]">{f.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right README Preview */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2 text-xs font-semibold text-white">
            <BookOpen className="w-4 h-4 text-[#6D5DF6]" />
            <span>README.md</span>
          </div>

          <div className="prose prose-invert prose-xs max-w-none text-[#A7AFBF] space-y-3">
            <h1 className="text-lg font-bold text-white">{slug}</h1>
            <p className="text-xs leading-relaxed">
              An open agent repository built for autonomous research, code inspection, and execution inside AgentSpace.
            </p>

            <h2 className="text-xs font-bold text-white uppercase tracking-wider pt-2">Installation</h2>
            <pre className="p-3 rounded-lg bg-[#05070B] border border-white/5 text-xs font-mono text-[#A7AFBF]">
              npm install @agentspace/sdk
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
