import { fetchHotelbeds, HotelbedsHotelDetailsResponse } from "@/lib/hotelbeds";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Check,
} from "lucide-react";

interface HotelDetailsPageProps {
  params: Promise<{ code: string }>;
}

const facilityIcons: Record<number, React.ReactNode> = {
  550: <Wifi className="h-4 w-4" />,
  363: <Waves className="h-4 w-4" />,
  200: <Car className="h-4 w-4" />,
  470: <UtensilsCrossed className="h-4 w-4" />,
};

function getStarRating(category?: { code: string }): number {
  if (!category?.code) return 0;
  const match = category.code.match(/(\d)/);
  return match ? parseInt(match[1]) : 0;
}

export default async function HotelDetailsPage({ params }: HotelDetailsPageProps) {
  const { code } = await params;

  let hotel;
  try {
    const data = await fetchHotelbeds<HotelbedsHotelDetailsResponse>(
      `/hotel-content-api/1.0/hotels/${code}?language=ENG&useSecondaryLanguage=false`
    );
    hotel = data.hotel;
  } catch (error) {
    console.error("Failed to fetch hotel:", error);
    notFound();
  }

  if (!hotel) {
    notFound();
  }

  const stars = getStarRating(hotel.category);
  const images = hotel.images?.slice(0, 8) || [];
  const mainImage = images[0]?.path
    ? `https://photos.hotelbeds.com/giata/${images[0].path}`
    : null;

  return (
    <div className="space-y-8 py-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/hotels">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted lg:aspect-[16/10]">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={hotel.name?.content || "Hotel"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Hotel Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {stars > 0 && (
                <Badge className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {stars} Star Hotel
                </Badge>
              )}
              {hotel.categoryGroup?.description?.content && (
                <Badge variant="secondary">
                  {hotel.categoryGroup.description.content}
                </Badge>
              )}
              {hotel.accommodationType?.typeDescription && (
                <Badge variant="outline">
                  {hotel.accommodationType.typeDescription}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {hotel.name?.content || `Hotel ${hotel.code}`}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">
                {hotel.city?.content && `${hotel.city.content}, `}
                {hotel.destinationCode}, {hotel.countryCode}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4">
            {hotel.phones?.[0] && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{hotel.phones[0].phoneNumber}</span>
              </div>
            )}
            {hotel.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${hotel.email}`} className="hover:underline">
                  {hotel.email}
                </a>
              </div>
            )}
            {hotel.web && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={hotel.web.startsWith("http") ? hotel.web : `https://${hotel.web}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Website
                </a>
              </div>
            )}
          </div>

          {/* Address */}
          {hotel.address?.content && (
            <Card>
              <CardContent className="flex gap-3 p-4">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <p className="text-sm">{hotel.address.content}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {images.slice(1).map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={`https://photos.hotelbeds.com/giata/${img.path}`}
                alt={`${hotel.name?.content} - Image ${idx + 2}`}
                fill
                className="object-cover transition-opacity hover:opacity-80"
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Description */}
          {hotel.description?.content && (
            <Card>
              <CardHeader>
                <CardTitle>About this hotel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description.content}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Facilities */}
          {hotel.facilities && hotel.facilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Popular Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {hotel.facilities.slice(0, 9).map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {facilityIcons[facility.facilityCode] || <Check className="h-4 w-4" />}
                      </div>
                      <span className="text-sm">
                        {facility.description?.content || `Facility ${facility.facilityCode}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="facilities" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Facilities & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              {hotel.facilities && hotel.facilities.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {hotel.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border p-3">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {facility.description?.content || `Facility ${facility.facilityCode}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No facility information available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {hotel.address?.content || "Not available"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">City</p>
                  <p className="text-sm text-muted-foreground">
                    {hotel.city?.content || hotel.destinationCode}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Country</p>
                  <p className="text-sm text-muted-foreground">{hotel.countryCode}</p>
                </div>
                {hotel.coordinates && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Coordinates</p>
                    <p className="text-sm text-muted-foreground">
                      {hotel.coordinates.latitude}, {hotel.coordinates.longitude}
                    </p>
                  </div>
                )}
              </div>

              {hotel.coordinates && (
                <>
                  <Separator />
                  <Button variant="outline" asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${hotel.coordinates.latitude},${hotel.coordinates.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Google Maps
                    </a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
