import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Cpu, ShieldCheck, Layers, Terminal, Sparkles, FolderGit2 } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "AgentSpace 2.0 — The Home for AI Agents",
  description: "Build, discover, execute, evaluate, version, and trust AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans antialiased flex flex-col">
        {/* Navigation Header */}
        <header className="border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#a78bfa] transition-colors">
                    AgentSpace <span className="text-xs px-1.5 py-0.5 rounded bg-[#8b5cf6]/20 text-[#c4b5fd] font-mono border border-[#8b5cf6]/30">2.0</span>
                  </span>
                  <span className="text-[10px] text-[#a1a1aa] tracking-wide uppercase font-mono">The Home for AI Agents</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="/" className="text-white hover:text-[#a78bfa] transition-colors flex items-center space-x-2">
                  <FolderGit2 className="w-4 h-4 text-[#8b5cf6]" />
                  <span>Repositories</span>
                </Link>
                <Link href="/" className="text-[#a1a1aa] hover:text-white transition-colors flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Marketplace</span>
                </Link>
                <Link href="/" className="text-[#a1a1aa] hover:text-white transition-colors flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Battle Mode</span>
                </Link>
                <Link href="/" className="text-[#a1a1aa] hover:text-white transition-colors flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verification</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center px-3 py-1.5 rounded-md bg-[#18181b] border border-[#27272a] text-xs font-mono text-[#a1a1aa]">
                <Terminal className="w-3.5 h-3.5 mr-2 text-[#8b5cf6]" />
                <span>api.agentspace.ai/v1</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-xs font-bold text-[#c4b5fd]">
                AG
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#27272a] bg-[#09090b] py-6 text-xs text-[#71717a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#8b5cf6]" />
              <span className="font-mono text-[#a1a1aa]">AgentSpace 2.0 Engine & Platform</span>
            </div>
            <div className="flex items-center space-x-6 font-mono">
              <span>Spec v1.0.0</span>
              <span>PostgreSQL + Prisma</span>
              <span>Gemini Runtime</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
