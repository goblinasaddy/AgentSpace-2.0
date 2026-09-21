"use client";

export function SpaceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep Canvas Layer */}
      <div className="absolute inset-0 bg-[#05050D]" />

      {/* Atmospheric Radial Gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[50vh] cosmic-glow-violet opacity-60 rounded-full blur-[100px]" />
      <div className="absolute top-[15%] right-[10%] w-[45vw] h-[45vh] cosmic-glow-blue opacity-50 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] left-[30%] w-[50vw] h-[40vh] cosmic-glow-magenta opacity-40 rounded-full blur-[130px]" />

      {/* Starfield Particles Grid */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Atmospheric Horizon Light Arc */}
      <div className="absolute top-[520px] left-1/2 -translate-x-1/2 w-[1200px] h-[300px]">
        {/* Glowing Horizon Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[2px] horizon-line shadow-[0_0_40px_rgba(139,92,246,0.8)]" />
        
        {/* Planetary Arc Gradient */}
        <div className="w-full h-full bg-gradient-to-b from-[#8B5CF6]/15 via-[#4D9CFF]/5 to-transparent rounded-[100%] blur-xl" />
      </div>

      {/* Digital Mountain / Horizon Line Silhouette */}
      <div className="absolute top-[520px] inset-x-0 flex justify-center opacity-40">
        <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-7xl">
          <path
            d="M0 220L180 160L360 190L540 120L720 170L900 130L1080 180L1260 140L1440 220V220H0Z"
            fill="url(#mountainGrad)"
          />
          <defs>
            <linearGradient id="mountainGrad" x1="720" y1="120" x2="720" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0D101A" stopOpacity="0.8" />
              <stop offset="1" stopColor="#05050D" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
