"use client";

import Link from "next/link";

interface AgentSpaceLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function AgentSpaceLogo({ size = "md", showWordmark = true }: AgentSpaceLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textClasses = {
    sm: "text-xs",
    md: "text-sm font-bold tracking-tight",
    lg: "text-lg font-extrabold tracking-tight",
  };

  return (
    <Link href="/" className="inline-flex items-center space-x-2.5 group select-none">
      {/* Abstract Cosmic Orbital Logo Symbol */}
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Outer subtle glowing ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4D9CFF] via-[#8B5CF6] to-[#D946EF] opacity-40 blur-[3px] group-hover:opacity-80 transition-opacity duration-300" />

        {/* Geometric Orbital SVG */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full text-white"
        >
          {/* Orbital Circle */}
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="url(#agentSpaceGrad)"
            strokeWidth="2"
            strokeDasharray="60 15"
          />
          {/* Central Agent Core Node */}
          <circle cx="16" cy="16" r="4.5" fill="#FFFFFF" />
          {/* Orbital Satellite Node */}
          <circle cx="25" cy="11" r="2.5" fill="#4D9CFF" />

          <defs>
            <linearGradient id="agentSpaceGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4D9CFF" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#D946EF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <span className={`${textClasses[size]} font-sans text-white group-hover:text-[#A78BFA] transition-colors`}>
          Agent<span className="text-[#8B5CF6]">Space</span>
        </span>
      )}
    </Link>
  );
}
