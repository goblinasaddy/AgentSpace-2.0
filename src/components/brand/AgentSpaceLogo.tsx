"use client";

import Link from "next/link";

interface AgentSpaceLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function AgentSpaceLogo({
  size = "md",
  showWordmark = true,
}: AgentSpaceLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textClasses = {
    sm: "text-xs font-bold",
    md: "text-sm font-bold tracking-tight",
    lg: "text-base font-extrabold tracking-tight",
  };

  return (
    <Link href="/" className="inline-flex items-center space-x-2 group select-none">
      {/* Abstract Geometric Orbital Mark */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="url(#agentSpaceOrbitalGrad)"
            strokeWidth="2.5"
            strokeDasharray="50 15"
          />
          <circle cx="16" cy="16" r="4.5" fill="#FFFFFF" />
          <circle cx="25" cy="11" r="2.5" fill="#4D8DFF" />

          <defs>
            <linearGradient
              id="agentSpaceOrbitalGrad"
              x1="4"
              y1="4"
              x2="28"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4D8DFF" />
              <stop offset="0.5" stopColor="#6D5DF6" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <span className={`${textClasses[size]} font-sans text-white group-hover:text-[#A78BFA] transition-colors`}>
          Agent<span className="text-[#6D5DF6]">Space</span>
        </span>
      )}
    </Link>
  );
}
