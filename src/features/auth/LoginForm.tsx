"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function LoginPanel({ onClose, onSwitchToRegister }: { onClose: () => void, onSwitchToRegister: () => void }) {
  return (
    <div className="fixed inset-0 flex">
      {/* Left side background */}

      {/* Right side Panel */}
      <div className="w-1/2 bg-white flex flex-col p-8 relative shadow-lg">
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
          onClick={onClose}
        >
          ←
        </button>

        <div className="mx-8 flex flex-col gap-4">
          <h2 className="text-8xl mt-12 text-gray-900">Login</h2>

          <p className="text-sm text-gray-600 mb-6">
            Don't have an account? <br />
            <button onClick={onSwitchToRegister} className="text-blue-600 underline cursor-pointer">
              Sign up here
            </button>
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
              <input id="email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-semibold text-gray-700">Password</label>
              <input id="password" type="password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
              <p className="text-xs text-gray-400 mt-auto cursor-pointer">Forgot password?</p>
            </div>
            
        
            <Button className="w-full cursor-pointer mt-2">Login</Button>
          </div>

        </div>
      </div>
    </div>
  );
}
