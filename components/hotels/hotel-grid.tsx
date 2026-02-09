'use client';

import { useHotels } from '@/contexts/hotel-context';
import { HotelCard } from './hotel-card';
import { Button } from '@/components/ui/button';
import { Loader2, Building2 } from 'lucide-react';

export function HotelGrid() {
  const { hotels, loading, searchHotels, to, total } = useHotels();
  const hasMore = to < total;

  const handleLoadMore = () => {
    searchHotels(true);
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Searching hotels...</p>
      </div>
    );
  }

  if (!loading && hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-16">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-medium">No hotels found</h3>
        <p className="text-center text-sm text-muted-foreground">
          Try adjusting your search filters or select a different destination.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{hotels.length}</span> of{' '}
          <span className="font-medium text-foreground">{total}</span> hotels
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.code} hotel={hotel} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More Hotels`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
