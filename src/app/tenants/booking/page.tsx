import { PropertyCard } from "@/components/ui/PropertyCard";
import SearchProperty from "@/components/ui/SearchProperty";
import TopBar from "@/components/ui/TopBar";

export default function BookingPage() {
    return(
    <div className="h-screen w-full bg-[#1D2D44] overflow-hidden flex flex-col">
      <TopBar pageName="Search Property" />
      <div className="ml-16 flex-1 overflow-hidden">
        <SearchProperty />
      </div>
    </div>
  );
}