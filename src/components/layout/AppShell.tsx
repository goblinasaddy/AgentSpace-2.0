"use client";

import { usePathname } from "next/navigation";
import { GlobalNav } from "./GlobalNav";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Marketing Shell pages have no sidebar
  const isMarketingShell =
    pathname === "/" || pathname.startsWith("/docs") || pathname.startsWith("/community");

  if (isMarketingShell) {
    return (
      <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans antialiased flex flex-col relative selection:bg-[#6D5DF6]/30 selection:text-white">
        <GlobalNav />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] text-[#F5F7FA] font-sans antialiased flex flex-col selection:bg-[#6D5DF6]/30 selection:text-white">
      <GlobalNav />
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
