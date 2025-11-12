"use client";

import Image from "next/image";

interface BanModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    reportId: number;
    reportedName: string;
    reporterName: string;
    reportedPersonalPicture?: string;
    reason?: string;
  } | null;
  onSubmit: (reportId: number) => Promise<void> | void;
}

export default function BanConfirmModal({
  open,
  onClose,
  user,
  onSubmit,
}: BanModalProps) {

  if (!open || !user) return null;

  const handleBan = async () => {
    await onSubmit(user.reportId);
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

        <h2 className="text-xl font-bold mb-4 pb-2">Ban Confirmation</h2>

        <div className="flex items-center gap-4 mb-10">
          <Image
            src={user.reportedPersonalPicture || "/default_profile.png"}
            alt={user.reportedName}
            width={48}
            height={48}
            className="rounded-full border border-gray-300 w-18 h-18"
          />
          <div className="text-sm text-gray-700">
            <p className="text-lg font-medium">{user.reportedName}</p>
            <p>
              Reported by: {user.reporterName}
            </p>
            {user.reason && <p>Reason: {user.reason}</p>}
          </div>
        </div>

        <div className="flex justify-center gap-3">
            <button
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white hover:cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-400 hover:bg-red-500 rounded-lg text-white hover:cursor-pointer"
            onClick={handleBan}
          >
            Ban
          </button>
        </div>
      </div>
    </div>
  );
}
