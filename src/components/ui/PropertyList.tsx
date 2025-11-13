import { PropertyCard } from "@/components/ui/PropertyCard";
import Link from "next/link";
import { Property } from "@/types/property";
import { SearchX } from "lucide-react";

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function PropertyList({ 
  properties, 
  loading, 
  error, 
  total, 
  page, 
  limit,
  onPageChange 
}: PropertyListProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Available Properties
          {total > 0 && (
            <span className="text-lg text-gray-400 ml-2">({total} results)</span>
          )}
        </h2>
      </div>
      
      {loading && (
        <div className="text-white text-center py-8">Loading properties...</div>
      )}
      
      {error && (
        <div className="text-red-400 text-center py-8">Error: {error}</div>
      )}
      
      {!loading && !error && (!properties || properties.length === 0) && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#1b2a3a] text-center text-white">
          <SearchX className="w-80 h-80 mb-6 text-gray-300" />
          <h1 className="text-5xl font-bold mb-2">Oops!</h1>
          <p className="text-gray-300 mb-4">
            We can’t seem to find what you’re looking for
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {properties && properties
          .filter((property) => property.isEmpty)
          .map((property) => (
            <Link 
              href={`/tenants/booking/${property.id}`} 
              key={property.id} 
              className="block"
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <PropertyCard property={property} />
            </Link>
          ))}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 rounded-lg transition ${
                  pageNum === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}