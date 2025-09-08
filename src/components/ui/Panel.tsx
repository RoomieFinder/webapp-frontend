"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Panel({ isOpen, onClose, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode; 
}) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          style={{
            backgroundImage: "url('/mock_night_city_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-50 flex flex-col justify-center items-center w-2/3 h-full absolute left-0 top-0">
            <div className="w-48 h-48 relative mb-4">
              <Image
                src="/logo.png"
                alt="RoomieFinder Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <h1 className="text-white text-5xl font-bold mb-6 text-center">RoomieFinder</h1>
            <p className="font-[var(--font-petit-formal)] text-white mb-8 text-lg text-center">Find Your Perfect Home</p>
          </div>
        </div>
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "50%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-2/3 bg-white shadow-2xl z-50 rounded-l-2xl p-6 overflow-y-auto"
      >
        {children}
      </motion.div>
    </>
  );
}