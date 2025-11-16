"use client";
import { useState } from "react";
import Image from "next/image";
import LoginForm from "@/features/auth/LoginForm";
import RegisterForm from "@/features/auth/RegisterForm";
import Panel from "../components/ui/Panel";
import Button from "@/components/ui/Button";
import CookieConsent from "@/components/ui/Cookie";

export default function HomePage() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-cover bg-center text-white" style={{ backgroundImage: "url('/mock_night_city_bg.jpg')", backgroundSize: "cover", backgroundPosition: "center"  }}>
      
      <div className="absolute inset-0 bg-black/50" /> {/* Overlay มืด 50% */}

      {/* Welcome Section */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container */}
        <div className="w-48 h-48 relative mb-4">
          <Image
            src="/logo.png"
            alt="RoomieFinder Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <h1 className="text-5xl font-bold mb-6">RoomieFinder</h1>
        <p className="font-[var(--font-petit-formal)] mb-8 text-2xl">Find Your Perfect Home</p>
        <Button className="w-60 h-15 cursor-pointer text-xl" onClick={() => { setPanelOpen(true); setShowRegister(false); }}>
          Get Started!
        </Button>
        <div>
          <CookieConsent />
        </div>
      </div>

      {/* Sliding Panel */}
      <Panel isOpen={panelOpen} onClose={() => setPanelOpen(false)}>
        {showRegister ? (
          <RegisterForm
            onSwitchToLogin={() => setShowRegister(false)} 
            onClose={() => setPanelOpen(false)} 
          />
        ) : (
          <LoginForm 
            onSwitchToRegister={() => setShowRegister(true)} 
            onClose={() => setPanelOpen(false)} 
          />
        )}
      </Panel>
    </div>
  );
}
