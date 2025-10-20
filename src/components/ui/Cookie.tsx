import { useState } from "react";

export default function CookieConsent() {
  const [isApproved, setIsApproved] = useState(false);

  const handleDecline = () => {
    alert("You must approve cookies to use this website.");
  };

  if (isApproved) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-180 px-4 z-50">
      <div className="bg-gray-100 rounded-lg shadow-2xl max-w-3xl w-full p-8 relative">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          This Website uses cookies and use your data
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-6 leading-relaxed">
          this website uses essential cookies and data to ensure its proper operation and tracking cookies to
          understand how you interact with it. The latter will be set only upon approval.{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Read more
          </a>
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setIsApproved(true)}
            className="px-8 py-3 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition font-medium"
          >
            Approve
          </button>
          <button
            onClick={handleDecline}
            className="px-8 py-3 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition font-medium"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}