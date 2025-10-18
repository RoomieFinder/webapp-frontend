import SearchGroup from "@/components/ui/SearchGroup";
import TopBar from "@/components/ui/TopBar";

export default function SearchGroupPage() {
    return(
    <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
      <TopBar pageName="Search Group" />
      <div className="ml-16 flex-1 overflow-auto">
        <SearchGroup />
      </div>
    </div>
    );
}