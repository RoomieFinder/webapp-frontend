import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";

interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  profilePicUrl: string;
}

export default function SearchHeader({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleKeyPress,
  showFilter,
  setShowFilter,
  profilePicUrl
}: SearchHeaderProps) {
  return (
    <div className="bg-slate-900 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search"
            className="w-full bg-gray-200 rounded-full px-6 py-3 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Search className="text-gray-600" size={20} />
          </button>
        </div>
        
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-gray-200 rounded-full px-6 py-3 flex items-center gap-2 hover:bg-gray-300 transition relative"
        >
          <span className="text-gray-600">Filter</span>
          <ChevronDown className={`text-gray-600 transition-transform ${showFilter ? 'rotate-180' : ''}`} size={20} />
        </button>
        
        <Link href="/tenants/profile">
          <img
            src={profilePicUrl || "/default_profile.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
}