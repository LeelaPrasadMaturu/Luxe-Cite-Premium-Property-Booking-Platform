'use client';

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48 bg-gray-200 animate-pulse" />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
        
        <div className="h-16 w-full bg-gray-200 rounded animate-pulse mb-3" />
        
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery Skeleton */}
      <div className="space-y-4">
        <div className="relative h-96 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-6">
        <div>
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="border-t border-b py-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div>
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCardSkeleton; 