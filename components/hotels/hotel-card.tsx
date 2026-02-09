'use client';

import { HotelbedsHotel } from '@/lib/hotelbeds';
import { useHotels } from '@/contexts/hotel-context';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Building2 } from 'lucide-react';
import Image from 'next/image';

interface HotelCardProps {
  hotel: HotelbedsHotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { addToCompare, removeFromCompare, isSelected, selectedHotels } = useHotels();
  const selected = isSelected(hotel.code);
  const canSelect = selectedHotels.length < 4 || selected;

  // Get star rating from category
  const getStarRating = () => {
    if (!hotel.category?.code) return 0;
    const match = hotel.category.code.match(/(\d)/);
    return match ? parseInt(match[1]) : 0;
  };

  const stars = getStarRating();

  // Get first image or placeholder
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

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${selected ? 'ring-2 ring-primary' : ''
        }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={hotel.name?.content || 'Hotel'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Selection checkbox */}
        <div className="absolute right-3 top-3">
          <div
            className={`flex items-center justify-center rounded-md bg-background/90 p-2 backdrop-blur-sm transition-opacity ${canSelect ? 'cursor-pointer hover:bg-background' : 'cursor-not-allowed opacity-50'
              }`}
            onClick={handleToggle}
          >
            <Checkbox
              checked={selected}
              disabled={!canSelect}
              className="h-5 w-5"
            />
          </div>
        </div>

        {/* Category badge */}
        {hotel.category?.description?.content && (
          <Badge
            variant="secondary"
            className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm"
          >
            {hotel.category.description.content}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Stars */}
        {stars > 0 && (
          <div className="mb-2 flex items-center gap-0.5">
            {Array.from({ length: stars }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight">
          {hotel.name?.content || 'Unknown Hotel'}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {hotel.city?.content || hotel.destinationCode} · {hotel.countryCode}
          </span>
        </div>

        {/* Facilities preview */}
        {hotel.facilities && hotel.facilities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {hotel.facilities.slice(0, 3).map((facility, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {facility.description?.content || `Facility ${facility.facilityCode}`}
              </Badge>
            ))}
            {hotel.facilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.facilities.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
