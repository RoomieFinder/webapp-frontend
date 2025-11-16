"use client";
import React from "react";
import TopBar from "@/components/ui/TopBar";
import EditProfile from "@/features/profile/EditProfile";

export default function ProfilePage() {
  return (
    <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
      <TopBar pageName="Edit Profile" />
      <EditProfile/>
    </div>
  );
}