'use client';

import { useHotels } from '@/contexts/hotel-context';
import { Button } from '@/components/ui/button';
import { X, GitCompareArrows } from 'lucide-react';
import Link from 'next/link';

export function CompareDrawer() {
  const { selectedHotels, removeFromCompare, clearComparison } = useHotels();

  if (selectedHotels.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex max-w-5xl items-center justify-between gap-4">
        {/* Selected hotels preview */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="flex-shrink-0 text-sm font-medium text-muted-foreground">
            Compare ({selectedHotels.length}/4):
          </span>
          <div className="flex items-center gap-2">
            {selectedHotels.map((hotel) => (
              <div
                key={hotel.code}
                className="flex items-center gap-2 rounded-full bg-primary/10 py-1 pl-3 pr-1"
              >
                <span className="max-w-[120px] truncate text-sm font-medium">
                  {hotel.name?.content || `Hotel ${hotel.code}`}
                </span>
                <button
                  onClick={() => removeFromCompare(hotel.code)}
                  className="rounded-full p-1 hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearComparison}>
            Clear All
          </Button>
          <Button asChild disabled={selectedHotels.length < 2}>
            <Link href="/compare">
              <GitCompareArrows className="mr-2 h-4 w-4" />
              Compare Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
