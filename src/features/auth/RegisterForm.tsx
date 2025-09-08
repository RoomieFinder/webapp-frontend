"use client";
import Button from "@/components/ui/Button";

export default function RegisterForm({ onClose, onSwitchToLogin }: { onClose: () => void, onSwitchToLogin: () => void }) {
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
          <h2 className="text-8xl mt-12 text-gray-900">Register</h2>

          <p className="text-sm text-gray-600 mb-6">
            <button onClick={onSwitchToLogin} className="text-blue-600 underline cursor-pointer">
              Already have an account?
            </button>
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="font-semibold text-gray-700">Name-Lastname</label>
              <input id="name" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="phone-number" className="font-semibold text-gray-700">Phone number</label>
              <input id="phone-number" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
              <input id="email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="font-semibold text-gray-700">Password</label>
              <input id="password" type="password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="confirm-password" className="font-semibold text-gray-700">Confirm Password</label>
              <input id="confirm-password" type="password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" />
            </div>
            
            <Button className="w-full cursor-pointer mt-2">Create Account</Button>
          </div>

        </div>
      </div>
    </div>
  );
}
