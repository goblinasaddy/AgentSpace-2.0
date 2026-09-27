"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Cpu,
  Star,
  GitFork,
  Play,
  Terminal,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchAgentDetails();
  }, [agentId]);

  const fetchAgentDetails = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/v1/agents/${agentId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setAgent(data.data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <ErrorState
        title="Agent not found."
        description="We couldn't load the requested agent."
        onRetry={() => fetchAgentDetails()}
      />
    );
  }

  const latestVersion = agent.versions && agent.versions.length > 0 ? agent.versions[0].version : "1.4.2";
  const repoOwner = agent.repository?.owner?.username || "aditya";
  const repoSlug = agent.repository?.slug || "webscout";
  const tags = agent.tags || ["research", "web", "productivity"];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "versions", label: "Versions", count: agent.versions?.length || 1 },
    { id: "readme", label: "README" },
    { id: "tools", label: "Tools" },
    { id: "discussions", label: "Discussions" },
    { id: "activity", label: "Activity" },
    { id: "verification", label: "Verification" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-[#6F788A]">
        <Link href="/explore" className="hover:text-white transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore</span>
        </Link>
        <span>&gt;</span>
        <span className="text-white font-medium">{agent.name}</span>
      </div>

      {/* Main Agent Header Panel */}
      <div className="p-6 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          {/* Identity & Badges */}
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-xl bg-[#6D5DF6]/15 border border-[#6D5DF6]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
              <Cpu className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">{agent.name}</h1>
                <Badge variant="verified" icon>Verified</Badge>
              </div>

              <div className="text-xs text-[#6F788A]">
                by <span className="text-[#A7AFBF]">@{repoOwner}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Star 128</span>
            </Button>
            <Button variant="secondary" size="sm">
              <GitFork className="w-3.5 h-3.5" />
              <span>Fork 34</span>
            </Button>
            <Link href={`/agents/${agent.id}/run`}>
              <Button variant="primary" size="sm">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Agent →</span>
              </Button>
            </Link>
            <Button variant="secondary" size="sm">
              <Terminal className="w-3.5 h-3.5" />
              <span>Use API</span>
            </Button>
          </div>
        </div>

        {/* Description & Tags */}
        <p className="text-xs text-[#A7AFBF] leading-relaxed max-w-3xl">
          {agent.description || "Research agent for finding, analyzing and summarizing information from the web using multiple sources."}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[11px] text-[#A7AFBF]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Split Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide">About</h2>
            <p className="text-xs text-[#A7AFBF] leading-relaxed">
              {agent.name} helps you search, analyze, and summarize information from the web using multiple sources.
            </p>

            <ul className="space-y-2 pt-2 text-xs text-[#A7AFBF]">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D5DF6]" />
                <span>Web search and extraction</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D5DF6]" />
                <span>Source citation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D5DF6]" />
                <span>Summarization and analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#6D5DF6]" />
                <span>Configurable depth and output format</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Details Sidebar */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#0D1118] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide">Details</h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6F788A]">Version</span>
                <span className="text-white font-mono">v{latestVersion}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6F788A]">License</span>
                <span className="text-white">MIT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#6F788A]">Created</span>
                <span className="text-white">Mar 12, 2026</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6F788A]">Last updated</span>
                <span className="text-white">Sep 10, 2026</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-2">
              <h3 className="text-xs font-semibold text-white">Verification</h3>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs text-[#34D399]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security Screened</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#4D8DFF]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Reliability Verified</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#A78BFA]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
