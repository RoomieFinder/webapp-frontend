"use client";
import React from "react";
import MiniDrawer from "@/components/ui/Sidebar";
import ExploreIcon from '@mui/icons-material/ExploreTwoTone';
import ProfileIcon from '@mui/icons-material/Person2TwoTone';
import FindRoommateIcon from '@mui/icons-material/SearchTwoTone';
import CreatePartyIcon from '@mui/icons-material/Groups2TwoTone';
import PaymentIcon from '@mui/icons-material/PaidTwoTone';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { text: "Explore", path: "/tenants",icon: <ExploreIcon/> },
    { text: "Profile", path: "/tenants/profile", icon: <ProfileIcon /> },
    { text: "Find Roommate", path: "/tenants/find-roommate", icon: <FindRoommateIcon /> },
    { text: "Create Party", path: "/tenants/create-party", icon: <CreatePartyIcon /> },
    { text: "Payment", path: "/tenants/payment", icon: <PaymentIcon /> },
  ];

  return (
    <div className="flex-1 bg-[#1D2D44] text-[var(--foreground)]">
      <MiniDrawer navItems={navItems} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
