import { useState } from "react";
import { Group } from "@/types/group";


export function GroupCard({ group }: { group: Group }) {
  const maxMembers = group.max_members || 10;
  const currentMembers = group.members?.length || 0;

  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestToJoin = async () => {
    setIsRequesting(true);

    try {
      const baseUrl = process.env.APP_ADDRESS || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/groupRequest/requests/groups/${group.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        // Add body if needed, for example:
        // body: JSON.stringify({ message: "I would like to join your group" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to send request: ${response.status}`);
      }

      const data = await response.json();
      console.log("Join request sent successfully:", data);
      
      alert("Request to join sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
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