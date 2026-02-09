"use client";

import { useEffect } from "react";
import { useHotels } from "@/contexts/hotel-context";
import { HotelCardEnhanced, HotelCardSkeleton } from "./hotel-card-enhanced";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Building2, ChevronDown, Grid3X3, List, Loader2, Search } from "lucide-react";

interface HotelGridEnhancedProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function HotelGridEnhanced({ view, onViewChange }: HotelGridEnhancedProps) {
  const { hotels, loading, searchHotels, to, total, selectedHotels } = useHotels();
  const hasMore = to < total;

  useEffect(() => {
    if (hotels.length === 0 && !loading) {
      searchHotels(false);
    }
  }, [hotels.length, loading, searchHotels]);

  const handleLoadMore = () => {
    searchHotels(true);
  };

  // Loading state
  if (loading && hotels.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className={view === "grid"
          ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-4"
        }>
          {Array.from({ length: 6 }).map((_, i) => (
            <HotelCardSkeleton key={i} view={view} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No hotels found</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Try adjusting your search filters or search for a different destination to find available hotels.
        </p>
        <Button variant="outline" onClick={() => searchHotels(false)}>
          <Search className="mr-2 h-4 w-4" />
          Search All Hotels
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{hotels.length}</span> of{" "}
            <span className="font-medium text-foreground">{total.toLocaleString()}</span> hotels
          </p>
          {selectedHotels.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {selectedHotels.length} selected
            </Badge>
          )}
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && onViewChange(v as "grid" | "list")}
          className="justify-end"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view" className="gap-2 px-3">
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" className="gap-2 px-3">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Grid/List */}
      <div className={view === "grid"
        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        : "flex flex-col gap-4"
      }>
        {hotels.map((hotel) => (
          <HotelCardEnhanced key={hotel.code} hotel={hotel} view={view} />
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
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Load More Hotels
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
