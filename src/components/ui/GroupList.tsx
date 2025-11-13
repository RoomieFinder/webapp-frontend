import { GroupCard } from "@/components/ui/GroupCard";
import Link from "next/link";
import { Group } from "@/types/group";

interface GroupListProps {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

export default function GroupList({ groups, loading, error }: GroupListProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Recommended for you</h2>
      
      {loading && (
        <div className="text-white text-center py-8">Loading groups...</div>
      )}
      
      {error && (
        <div className="text-red-400 text-center py-8">Error: {error}</div>
      )}
      
      {!loading && !error && groups.length === 0 && (
        <div className="text-white text-center py-8">No groups found</div>
      )}
      
      <div className="space-y-4">
        {groups
          .filter((group) => group.is_visible === 1)
          .map((group) => (
            <Link 
              href={`/tenants/group/${group.id}`} 
              key={group.id} 
              className="block"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <GroupCard group={group} />
            </Link>
          ))}
      </div>
    </div>
  );
}