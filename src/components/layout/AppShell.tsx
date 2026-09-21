"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { MarketingNav } from "./MarketingNav";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#05050D] text-[#F4F4F5] font-sans antialiased flex flex-col relative overflow-hidden selection:bg-[#8B5CF6]/30 selection:text-white">
        <MarketingNav />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050D] text-[#F4F4F5] font-sans antialiased flex flex-col selection:bg-[#8B5CF6]/30 selection:text-white">
      <TopNav />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
