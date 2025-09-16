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
    { text: "Explore", path: "/landlords",icon: <ExploreIcon/> },
    { text: "Profile", path: "/landlords/profile", icon: <ProfileIcon /> },
    { text: "Post Properties", path: "/landlords/posting", icon: <FindRoommateIcon /> },
    { text: "Properties Management", path: "/landlords/booking", icon: <CreatePartyIcon /> },
    { text: "Payment", path: "/landlords/payment", icon: <PaymentIcon /> },
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
