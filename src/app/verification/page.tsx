"use client";

import { useState } from "react";
import { Award, ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { VerificationBadge } from "@/components/verification/VerificationBadge";

export default function VerificationCenterPage() {
  const [agentVersionId, setAgentVersionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentVersionId) {
      alert("Please provide an AgentVersion ID.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setCreatedRequestId(null);

    try {
      const token = localStorage.getItem("agentspace_token");
      const res = await fetch("/api/v1/verification/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          agentVersionId,
          requestedBadges: ["SECURITY_SCREENED", "RELIABILITY_VERIFIED"],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCreatedRequestId(data.data.id);
      } else {
        setError(data.error?.message || "Verification request failed.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" /> Verification Center & Trust Assurance
        </h1>
        <p className="text-xs text-[#a1a1aa] font-mono">
          Request evidence-based security and reliability screening for specific published AgentVersion artifacts.
        </p>
      </div>

      {/* Trust Badges Taxonomy Showcase */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase">Attestation Badge Taxonomy</h2>
        <div className="flex flex-wrap gap-3">
          <VerificationBadge badgeType="SECURITY_SCREENED" version="1.0.0" />
          <VerificationBadge badgeType="RELIABILITY_VERIFIED" version="1.0.0" />
          <VerificationBadge badgeType="PRIVACY_VERIFIED" version="1.0.0" />
        </div>
        <p className="text-xs text-[#71717a] font-mono">
          Verification badges are evidence-based attestations bound strictly to exact published version hashes.
        </p>
      </div>

      {/* Request Verification Form */}
      <form onSubmit={handleRequestVerification} className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase">Request Screening for AgentVersion</h2>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {createdRequestId && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold">Verification Request Initialized!</span> (Request ID: {createdRequestId})
            </div>
            <Link
              href={`/verification/${agentVersionId}`}
              className="text-white hover:underline flex items-center gap-1 font-bold"
            >
              <span>View Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div>
          <label className="text-[11px] font-mono text-[#a1a1aa] uppercase">Target AgentVersion ID</label>
          <input
            type="text"
            placeholder="e.g. cm123agentv1"
            value={agentVersionId}
            onChange={(e) => setAgentVersionId(e.target.value)}
            required
            className="w-full mt-1 p-2.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-white font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-mono text-xs font-bold rounded-lg transition-all shadow-md shadow-[#8b5cf6]/20"
        >
          {isSubmitting ? "Submitting Screening Request..." : "Request Automated Security Screening"}
        </button>
      </form>
    </div>
  );
}
