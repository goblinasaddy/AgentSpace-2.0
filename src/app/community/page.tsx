"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, Plus } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");

  const tabs = [
    { id: "discussions", label: "Discussions", count: 12 },
    { id: "featured", label: "Featured" },
    { id: "updates", label: "Updates" },
    { id: "contributors", label: "Contributors" },
  ];

  const threads = [
    {
      id: "1",
      title: "Best practices for tool integration",
      author: "priya",
      time: "2 days ago",
      replies: 12,
      upvotes: 8,
    },
    {
      id: "2",
      title: "How to evaluate agent performance?",
      author: "rohan",
      time: "4 days ago",
      replies: 5,
      upvotes: 3,
    },
    {
      id: "3",
      title: "Showcase your agents",
      author: "archan",
      time: "1 week ago",
      replies: 8,
      upvotes: 6,
    },
    {
      id: "4",
      title: "MCP server integration tips",
      author: "gunjan",
      time: "1 week ago",
      replies: 4,
      upvotes: 2,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Community</h1>
          <p className="text-xs text-[#6F788A]">Discuss, share and learn with the AgentSpace community.</p>
        </div>

        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span>New Discussion</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Thread List */}
      <div className="space-y-3">
        {threads.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-xl bg-[#0D1118] border border-white/10 flex items-center justify-between hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                {t.author[0]}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white hover:text-[#A78BFA] transition-colors">
                  {t.title}
                </h3>
                <p className="text-[11px] text-[#6F788A] mt-0.5">
                  @{t.author} · {t.time}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-[#6F788A]">
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.replies}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{t.upvotes}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
