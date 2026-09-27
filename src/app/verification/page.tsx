"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("agents");

  const tabs = [
    { id: "agents", label: "Agents", count: 4 },
    { id: "tools", label: "Tools" },
    { id: "mcp", label: "MCP Servers" },
  ];

  const verifiedArtifacts = [
    {
      id: "webscout",
      name: "WebScout",
      version: "v1.4.2",
      badges: ["Security Screened", "Reliability Verified"],
    },
    {
      id: "pdf-analyst",
      name: "PDF Analyst",
      version: "v1.0.1",
      badges: ["Security Screened", "Privacy Verified"],
    },
    {
      id: "codebuddy",
      name: "CodeBuddy",
      version: "v2.1.0",
      badges: ["Reliability Verified", "Compatibility Verified"],
    },
    {
      id: "dataviz",
      name: "DataViz Agent",
      version: "v1.3.0",
      badges: ["Security Screened"],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-[#34D399]" /> Verification
        </h1>
        <p className="text-xs text-[#6F788A]">Verify agents, tools and MCP servers.</p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Verified Artifact List Rows */}
      <div className="space-y-3">
        {verifiedArtifacts.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#0D1118] border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <span className="text-xs font-mono text-[#6F788A]">{item.version}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {item.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 text-[10px] font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link href={`/verification/${item.id}`}>
              <Button variant="secondary" size="sm">
                View Report
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
