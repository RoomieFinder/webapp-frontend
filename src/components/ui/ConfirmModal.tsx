"use client";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirmation",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#1e293b] text-white rounded-2xl shadow-lg p-6 w-96 text-center">
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white hover:cursor-pointer"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-red-400 hover:bg-red-500 rounded-lg text-white hover:cursor-pointer"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
