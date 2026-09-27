"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cpu, Plus, Edit } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("agents");
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUserWorkspace();
  }, []);

  const fetchUserWorkspace = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem("agentspace_token");
      const res = await fetch("/api/v1/agents", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAgents(data.data || []);
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
    { id: "agents", label: "My Agents", count: agents.length },
    { id: "runs", label: "Runs" },
    { id: "repositories", label: "Repositories" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Workspace</h1>
        <Link href="/build">
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span>New Agent</span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : error ? (
        <ErrorState
          title="Couldn't load workspace."
          description="We couldn't retrieve your agents right now."
          onRetry={() => fetchUserWorkspace()}
        />
      ) : agents.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1118] rounded-lg border border-white/10 space-y-3">
          <p className="text-sm font-medium text-white">No agents in your workspace yet.</p>
          <p className="text-xs text-[#6F788A]">Create your first agent to get started.</p>
          <div className="pt-2">
            <Link href="/build">
              <Button variant="primary" size="sm">
                <span>Create Agent</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-lg bg-[#0D1118] border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-md bg-[#6D5DF6]/15 border border-[#6D5DF6]/30 flex items-center justify-center text-[#A78BFA]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <Link href={`/agents/${agent.id}`} className="text-sm font-bold text-white hover:text-[#A78BFA] transition-colors">
                    {agent.name}
                  </Link>
                  <p className="text-xs text-[#6F788A] line-clamp-1">{agent.description || "Autonomous agent."}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link href={`/agents/${agent.id}`}>
                  <Button variant="secondary" size="sm">
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
