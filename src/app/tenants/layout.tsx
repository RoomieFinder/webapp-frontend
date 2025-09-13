"use client";
import React from "react";
import MiniDrawer from "@/components/ui/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MiniDrawer />
        <main className="flex-1 bg-[#1D2D44] text-[var(--foreground)]">
          {children}
        </main>
      </body>
    </html>
  );
}
