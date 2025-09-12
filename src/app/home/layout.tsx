"use client";
import React, { useState } from "react";
import { Drawer, Button, IconButton } from '@mui/material';
import MiniDrawer from "@/components/ui/Sidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <MiniDrawer />
            <main className="flex-1 bg-[#1D2D44] text-[var(--foreground)]">
                {children}
            </main>
        </div>
    );
}