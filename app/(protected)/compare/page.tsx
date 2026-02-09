'use client';

import { useHotels } from '@/contexts/hotel-context';
import { ComparisonCharts } from '@/components/hotels/comparison-charts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const { selectedHotels, clearComparison } = useHotels();

  if (selectedHotels.length < 2) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Not enough hotels to compare</h2>
        <p className="mb-6 text-center text-muted-foreground">
          Please select at least 2 hotels from the search results to compare.
        </p>
        <Button asChild>
          <Link href="/hotels">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
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

      {/* Charts */}
      <ComparisonCharts hotels={selectedHotels} />
    </div>
  );
}
