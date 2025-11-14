import { getUser, apiServices } from "@/api";
import { useEffect, useState } from "react";
import { Group } from "@/types/group";


export function GroupCard({ group }: { group: Group }) {
  const maxMembers = group.max_members || 10;
  const currentMembers = group.members?.length || 0;

  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const handleRequestToJoin = async () => {
    setIsRequesting(true);
    setRequestError(null);

    try {
      const success = await apiServices.joinGroup(group.id);
      if (!success) throw new Error("Failed to send join request");
      alert("Request to join sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      setRequestError(error instanceof Error ? error.message : "Failed to send request");
      alert(`Failed to send join request: ${error instanceof Error ? error.message : "Please try again"}`);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">
      <img
        src={group.group_picture || "/default_profile.png"}
        alt={group.name}
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
      />

      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
            <p className="text-sm text-gray-600">created by {group.members[0]?.name || "unknown"}</p>
          </div>
          <span className="text-gray-700 font-medium">
            members: {currentMembers}/{maxMembers}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {group.hobbies && group.hobbies.length > 0 ? (
            group.hobbies.map((hobby) => (
              <span
                key={hobby.id}
                className="px-4 py-2 bg-slate-500 text-white rounded-md text-sm"
              >
                {hobby.name}
              </span>
            ))
          ) : (
            <span className="px-4 py-2 bg-slate-500 text-white rounded-md text-sm">
              No hobbies listed
            </span>
          )}
        </div>
      </div>

      <button
        className={`px-6 py-3 rounded-lg font-medium transition flex-shrink-0
          ${isRequesting
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-amber-100 text-gray-800 hover:bg-amber-200"
          }`}
        onClick={(e) => {
          e.preventDefault(); // Prevents link navigation
          e.stopPropagation(); // Stops event from bubbling to parent Link
          handleRequestToJoin();
        }}
        disabled={isRequesting}
      >
        {isRequesting ? "Sending..." : "Request to join"}
      </button>
    </div>
  );
}