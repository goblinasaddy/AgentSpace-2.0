"use client";

import { ShieldCheck, ShieldAlert, Award, Lock, Cpu } from "lucide-react";

interface VerificationBadgeProps {
  badgeType: "SECURITY_SCREENED" | "RELIABILITY_VERIFIED" | "PRIVACY_VERIFIED" | "COMPATIBILITY_VERIFIED" | "PERFORMANCE_VERIFIED" | string;
  version?: string;
  size?: "sm" | "md";
}

export function VerificationBadge({ badgeType, version, size = "md" }: VerificationBadgeProps) {
  const getBadgeConfig = () => {
    switch (badgeType) {
      case "SECURITY_SCREENED":
        return {
          label: "Security Screened",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: ShieldCheck,
        };
      case "RELIABILITY_VERIFIED":
        return {
          label: "Reliability Verified",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: Award,
        };
      case "PRIVACY_VERIFIED":
        return {
          label: "Privacy Verified",
          color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          icon: Lock,
        };
      default:
        return {
          label: badgeType.replace(/_/g, " "),
          color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
          icon: Cpu,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono border ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
        {version && <span className="opacity-60">({version})</span>}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-mono border ${config.color}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="font-semibold">{config.label}</span>
      {version && <span className="opacity-70 text-[10px]">v{version}</span>}
    </div>
  );
}
