"use client";

interface SuccessModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void; // กด OK จะเรียกฟังก์ชันนี้
}

export default function SuccessModal({
  open,
  title = "Success",
  message,
  onConfirm,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white text-black rounded-2xl shadow-lg p-6 w-96 text-center">
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center">
          <button
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg text-white hover:cursor-pointer"
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
