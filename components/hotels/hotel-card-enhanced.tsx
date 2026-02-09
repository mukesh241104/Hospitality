"use client";

import { useHotels } from "@/contexts/hotel-context";
import { HotelbedsHotel } from "@/lib/hotelbeds";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2,
  MapPin,
  Star,
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Eye,
  Check
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  hotel: HotelbedsHotel;
  view?: "grid" | "list";
}

const facilityIcons: Record<number, React.ReactNode> = {
  550: <Wifi className="h-3.5 w-3.5" />,
  363: <Waves className="h-3.5 w-3.5" />,
  200: <Car className="h-3.5 w-3.5" />,
  470: <UtensilsCrossed className="h-3.5 w-3.5" />,
};

function getStarRating(category?: { code: string }): number {
  if (!category?.code) return 0;
  const match = category.code.match(/(\d)/);
  return match ? parseInt(match[1]) : 0;
}

export function HotelCardEnhanced({ hotel, view = "grid" }: HotelCardProps) {
  const { addToCompare, removeFromCompare, isSelected, selectedHotels } = useHotels();
  const selected = isSelected(hotel.code);
  const canSelect = selectedHotels.length < 4 || selected;
  const stars = getStarRating(hotel.category);

  const imageUrl = hotel.images?.[0]?.path
    ? `https://photos.hotelbeds.com/giata/${hotel.images[0].path}`
    : null;

  const handleToggle = () => {
    if (selected) {
      removeFromCompare(hotel.code);
    } else if (canSelect) {
      addToCompare(hotel);
    }
  };

  if (view === "list") {
    return (
      <Card className={cn(
        "group overflow-hidden transition-all duration-200 hover:shadow-lg",
        selected && "ring-2 ring-primary shadow-lg"
      )}>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative aspect-video w-full sm:aspect-square sm:w-48 md:w-64 flex-shrink-0 overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={hotel.name?.content || "Hotel"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            {stars > 0 && (
              <Badge className="absolute left-3 top-3 gap-1 bg-background/90 text-foreground backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {stars}
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex flex-1 flex-col justify-between p-4 sm:p-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold leading-tight text-lg line-clamp-1">
                    {hotel.name?.content || `Hotel ${hotel.code}`}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">
                      {hotel.city?.content || hotel.destinationCode}, {hotel.countryCode}
                    </span>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border transition-colors",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 hover:border-primary"
                      )}
                      onClick={handleToggle}
                    >
                      {selected && <Check className="h-4 w-4" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {selected ? "Remove from compare" : canSelect ? "Add to compare" : "Max 4 hotels"}
                  </TooltipContent>
                </Tooltip>
              </div>

              {hotel.description?.content && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {hotel.description.content}
                </p>
              )}

              {/* Facilities */}
              {hotel.facilities && hotel.facilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {hotel.facilities.slice(0, 6).map((facility, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1 text-xs">
                      {facilityIcons[facility.facilityCode] || null}
                      {facility.description?.content?.split(" ").slice(0, 2).join(" ") || `Facility ${facility.facilityCode}`}
                    </Badge>
                  ))}
                  {hotel.facilities.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{hotel.facilities.length - 6} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {hotel.accommodationType?.typeDescription || hotel.categoryGroup?.description?.content}
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/hotels/${hotel.code}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      selected && "ring-2 ring-primary shadow-lg"
    )}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={hotel.name?.content || "Hotel"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {stars > 0 && (
            <Badge className="gap-1 bg-background/90 text-foreground backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {stars} Star
            </Badge>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 bg-background/90 backdrop-blur-sm transition-all",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-transparent hover:border-primary"
                )}
                onClick={handleToggle}
              >
                <Checkbox
                  checked={selected}
                  disabled={!canSelect && !selected}
                  className="pointer-events-none h-4 w-4"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {selected ? "Remove from compare" : canSelect ? "Add to compare" : "Max 4 hotels"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold leading-tight line-clamp-1">
              {hotel.name?.content || `Hotel ${hotel.code}`}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {hotel.city?.content || hotel.destinationCode}, {hotel.countryCode}
              </span>
            </div>
          </div>

          {/* Facilities icons */}
          {hotel.facilities && hotel.facilities.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              {hotel.facilities.slice(0, 4).map((facility, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      {facilityIcons[facility.facilityCode] || <Building2 className="h-3.5 w-3.5" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {facility.description?.content || `Facility ${facility.facilityCode}`}
                  </TooltipContent>
                </Tooltip>
              ))}
              {hotel.facilities.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{hotel.facilities.length - 4}
                </span>
              )}
            </div>
          )}

          <Button className="w-full" variant="outline" size="sm" asChild>
            <Link href={`/hotels/${hotel.code}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loaders
export function HotelCardSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  if (view === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <Skeleton className="aspect-video w-full sm:aspect-square sm:w-48 md:w-64" />
          <div className="flex-1 p-4 sm:p-5 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
}
