"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, GitFork, FolderGit2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BuildAgentPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState("blank");
  const [currentStep, setCurrentStep] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creationModes = [
    {
      id: "blank",
      title: "Blank Agent",
      subtitle: "Create from scratch",
      icon: Cpu,
    },
    {
      id: "fork",
      title: "Fork Existing",
      subtitle: "Use an existing agent as a base",
      icon: GitFork,
    },
    {
      id: "import",
      title: "Import Repository",
      subtitle: "Connect a Git repository",
      icon: FolderGit2,
    },
  ];

  const steps = [
    { id: 1, title: "Identity", desc: "Basic information about your agent." },
    { id: 2, title: "Capabilities", desc: "What your agent can do." },
    { id: 3, title: "Tools", desc: "Integrate tools and APIs." },
    { id: 4, title: "Input / Output", desc: "Define input and output format." },
    { id: 5, title: "Permissions", desc: "Set required permissions." },
    { id: 6, title: "Publish", desc: "Review and publish your agent." },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePublish();
    }
  };

  const handlePublish = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("agentspace_token");
      const res = await fetch("/api/v1/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          description,
          systemPrompt,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/agents/${data.data.id}`);
      } else {
        alert(`Creation failed: ${data.error?.message || "Error"}`);
      }
    } catch {
      alert("Network error creating agent.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Build an Agent</h1>
        <p className="text-xs text-[#6F788A]">Create and publish your own agent.</p>
      </div>

      {/* Creation Mode Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {creationModes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`p-5 rounded-xl text-left border transition-all ${
                isSelected
                  ? "bg-[#6D5DF6]/10 border-[#6D5DF6] text-white"
                  : "bg-[#0D1118] border-white/10 text-[#A7AFBF] hover:border-white/20"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A78BFA] mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">{mode.title}</h3>
              <p className="text-xs text-[#6F788A] mt-1">{mode.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Main Step Flow View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Step Indicators Sidebar */}
        <div className="space-y-3">
          {steps.map((s) => {
            const isCurrent = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            return (
              <div key={s.id} className="flex items-start space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5 ${
                    isCurrent
                      ? "bg-[#6D5DF6] text-white font-bold"
                      : isCompleted
                      ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 font-bold"
                      : "bg-white/5 text-[#6F788A] border border-white/10"
                  }`}
                >
                  {s.id}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent ? "text-white" : "text-[#A7AFBF]"
                    }`}
                  >
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#6F788A]">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Form Details */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0D1118] border border-white/10 space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                1. Identity
              </h3>
              <div className="space-y-1">
                <label className="text-xs text-[#6F788A]">Agent Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. WebScout"
                  className="w-full p-2.5 rounded-lg bg-[#05070B] border border-white/10 text-xs text-white focus:border-[#6D5DF6] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#6F788A]">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your agent do?"
                  className="w-full p-2.5 rounded-lg bg-[#05070B] border border-white/10 text-xs text-white focus:border-[#6D5DF6] focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {currentStep > 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                {currentStep}. {steps[currentStep - 1].title}
              </h3>
              <div className="space-y-1">
                <label className="text-xs text-[#6F788A]">System Instructions / Configuration</label>
                <textarea
                  rows={4}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Define your agent system prompt or capabilities..."
                  className="w-full p-2.5 rounded-lg bg-[#05070B] border border-white/10 text-xs text-white font-mono focus:border-[#6D5DF6] focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            {currentStep > 1 ? (
              <Button variant="secondary" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            ) : <div />}

            <Button variant="primary" size="md" onClick={handleNextStep} disabled={isSubmitting}>
              <span>{currentStep === steps.length ? "Publish Agent" : "Next"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
