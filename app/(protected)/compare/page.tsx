'use client';

import { useHotels } from '@/contexts/hotel-context';
import { ComparisonCharts } from '@/components/hotels/comparison-charts';
import { HotelFiltersEnhanced } from '@/components/hotels/hotel-filters-enhanced';
import { HotelGridEnhanced } from '@/components/hotels/hotel-grid-enhanced';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { selectedHotels, clearComparison } = useHotels();



  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Compare Hotels</h1>
          <p className="text-muted-foreground">
            Comparing {selectedHotels.length} hotels side by side
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
          <Button variant="outline" asChild>
            <Link href="/hotels">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>

      {/* Comparison Charts (always visible if hotels selected) */}
      {selectedHotels.length > 0 ? (
        <ComparisonCharts hotels={selectedHotels} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center text-muted-foreground">
          <Building2 className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p>Select hotels below to start comparing</p>
        </div>
      )}

      {/* Hotel Selection Grid */}
      <div className="pt-8 border-t">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Select Hotels to Compare
        </h2>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <Card className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
              <HotelFiltersEnhanced />
            </Card>
          </aside>

          {/* Main Grid */}
          <main className="min-w-0 flex-1">
            <HotelGridEnhanced view="grid" onViewChange={() => { }} />
          </main>
        </div>
      </div>
    </div>
  );
}
