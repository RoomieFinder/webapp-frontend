"use client";

import { useState } from "react";
import Image from "next/image";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  user: { id: number; name: string; personalPicture?: string } | null;
  onSubmit: (reason: string, userId: number) => Promise<void> | void;
}

export default function ReportModal({ open, onClose, user, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState("");

  if (!open || !user) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return alert("Please state your reason.");
    await onSubmit(reason, user.id);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[480px] shadow-xl p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-4 text-xl font-semibold text-gray-500 hover:text-black hover:cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Report</h2>

        <div className="flex items-center gap-3 mb-6">
          <Image
            src={user.personalPicture || "/default_profile.png"}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-full border border-gray-300 w-18 h-18"
          />
          <span className="text-lg font-medium">{user.name}</span>
        </div>

        <label className="block text-gray-700 font-medium mb-2">
          Reason for reporting
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="State your reason ..."
          className="w-full border rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-5"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded-lg font-medium hover:cursor-pointer"
        >
          Report User
        </button>
      </div>
    </div>
  );
}
