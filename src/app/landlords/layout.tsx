"use client";
import React from "react";
import MiniDrawer from "@/components/ui/Sidebar";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <MiniDrawer />
      <main className="flex-1 bg-[#1D2D44] text-[var(--foreground)]">
        {children}
      </main>
    </div>
  );
}
