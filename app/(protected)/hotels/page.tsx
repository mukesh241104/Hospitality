"use client";

import { useState } from "react";
import { HotelFiltersEnhanced } from "@/components/hotels/hotel-filters-enhanced";
import { HotelGridEnhanced } from "@/components/hotels/hotel-grid-enhanced";
import { CompareDrawer } from "@/components/hotels/compare-drawer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

export default function HotelsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="py-6">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Search Hotels</h1>
        <p className="text-muted-foreground">
          Discover and compare hotels from around the world
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <Card className="sticky top-24 p-5">
            <HotelFiltersEnhanced />
          </Card>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Mobile Filter Button */}
          <div className="mb-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="py-4">
                  <HotelFiltersEnhanced />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Hotel Grid */}
          <HotelGridEnhanced view={view} onViewChange={setView} />
        </main>
      </div>

      {/* Compare Drawer */}
      <CompareDrawer />
    </div>
  );
}
