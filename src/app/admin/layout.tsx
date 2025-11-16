"use client";
import React from "react";
import MiniDrawer from "@/components/ui/Sidebar";
import BuildIcon from "@mui/icons-material/Build";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    // { text: "Explore", path: "/tenants", icon: <ExploreIcon /> },
    // { text: "Profile", path: "/tenants/profile", icon: <ProfileIcon /> },
    // { text: "Booking", path: "/tenants/booking", icon: <FindRoommateIcon /> },
    // { text: "Group", path: "/tenants/group", icon: <CreatePartyIcon /> },
    { text: "Report", path: "/admin/reports", icon: <BuildIcon /> },
  ];

  return (
    <div className="flex-1 bg-[#1D2D44] text-[var(--foreground)]">
      <MiniDrawer navItems={navItems} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
