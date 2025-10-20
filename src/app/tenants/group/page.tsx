import GroupOptionBox from "@/components/ui/GroupOptionBox";
import TopBar from "@/components/ui/TopBar";
import EditProfile from "@/features/profile/EditProfile";
import { AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
      <TopBar pageName="Group" />
    <div className="min-h-screen w-full bg-slate-800 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header with Alert */}
        <div className="flex items-start gap-6 mb-12">
          <AlertTriangle className="text-white flex-shrink-0" size={80} strokeWidth={1.5} />
          <div>
            <h1 className="text-white text-4xl font-bold mb-3">
              Seem like you don't have a group yet.
            </h1>
            <p className="text-gray-300 text-xl">
              You can find your roommates with the options below !
            </p>
          </div>
        </div>

        {/* Group Options */}
        <div className="space-y-6">
          <GroupOptionBox
            title="Create a group"
            description="You'll be the leader and can manage the group"
            path="/tenants/group/create"
          />
          
          <GroupOptionBox
            title="Join a group"
            description="You'll be a member of any group you choose"
            path="/tenants/group/join"
          />
        </div>
      </div>
    </div>
    </div>
  );
}