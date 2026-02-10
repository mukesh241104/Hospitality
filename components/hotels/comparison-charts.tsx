'use client';

import { HotelbedsHotel } from '@/lib/hotelbeds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Cell, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Star, MapPin, Building2, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface ComparisonChartsProps {
  hotels: HotelbedsHotel[];
}

// Generate chart colors
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

export function ComparisonCharts({ hotels }: ComparisonChartsProps) {
  // Extract star ratings
  const getStarRating = (hotel: HotelbedsHotel) => {
    if (!hotel.category?.code) return 0;
    const match = hotel.category.code.match(/(\d)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Prepare price data (Mocked for demonstration as per request)
  const priceData = hotels.map((hotel, index) => ({
    name: hotel.name?.content?.substring(0, 15) || `Hotel ${index + 1}`,
    price: Math.floor(Math.random() * 300) + 100, // Mock price $100-$400
    fill: COLORS[index % COLORS.length],
  }));

  // Prepare facilities count data
  const facilitiesData = hotels.map((hotel, index) => ({
    name: hotel.name?.content?.substring(0, 15) || `Hotel ${index + 1}`,
    facilities: hotel.facilities?.length || 0,
    fill: COLORS[index % COLORS.length],
  }));

  // Chart config
  const priceChartConfig: ChartConfig = {
    price: {
      label: 'Price per Night ($)',
    },
    ...Object.fromEntries(
      hotels.map((hotel, index) => [
        hotel.name?.content?.substring(0, 15) || `Hotel ${index + 1}`,
        { label: hotel.name?.content || `Hotel ${index + 1}`, color: COLORS[index % COLORS.length] },
      ])
    ),
  };

  const facilitiesChartConfig: ChartConfig = {
    facilities: {
      label: 'Facilities Count',
    },
    ...Object.fromEntries(
      hotels.map((hotel, index) => [
        hotel.name?.content?.substring(0, 15) || `Hotel ${index + 1}`,
        { label: hotel.name?.content || `Hotel ${index + 1}`, color: COLORS[index % COLORS.length] },
      ])
    ),
  };

  return (
    <div className="space-y-8">
      {/* Hotel Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hotels.map((hotel, index) => {
          const stars = getStarRating(hotel);
          const imageUrl = hotel.images?.[0]?.path
            ? `https://photos.hotelbeds.com/giata/${hotel.images[0].path}`
            : null;

          return (
            <Card key={hotel.code} className="overflow-hidden">
              <div
                className="h-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="relative aspect-video overflow-hidden bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={hotel.name?.content || 'Hotel'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="mb-2 line-clamp-2 font-semibold">
                  {hotel.name?.content || 'Unknown Hotel'}
                </h3>
                <div className="mb-2 flex items-center gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  {stars === 0 && <span className="text-sm text-muted-foreground">No rating</span>}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{hotel.city?.content || hotel.destinationCode}</span>
                </div>
                <Badge variant="outline" className="mt-2">
                  {hotel.facilities?.length || 0} facilities
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price Comparison (Est.)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={priceChartConfig} className="h-[300px] w-full">
              <BarChart data={priceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} hide />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                  {priceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Facilities Count Chart (Radial) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facilities Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={facilitiesChartConfig} className="h-[300px] w-full mx-auto">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={facilitiesData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  label={{ fill: '#666', position: 'insideStart' }}
                  background
                  dataKey="facilities"
                  cornerRadius={5}
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Property</th>
                  {hotels.map((hotel, index) => (
                    <th key={hotel.code} className="py-3 text-left font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {hotel.name?.content?.substring(0, 20) || `Hotel ${index + 1}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium">Category</td>
                  {hotels.map(hotel => (
                    <td key={hotel.code} className="py-3">
                      {hotel.category?.description?.content || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Location</td>
                  {hotels.map(hotel => (
                    <td key={hotel.code} className="py-3">
                      {hotel.city?.content || hotel.destinationCode}, {hotel.countryCode}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Accommodation Type</td>
                  {hotels.map(hotel => (
                    <td key={hotel.code} className="py-3">
                      {hotel.accommodationType?.typeDescription || hotel.accommodationType?.code || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Facilities</td>
                  {hotels.map(hotel => (
                    <td key={hotel.code} className="py-3">
                      {hotel.facilities?.length || 0} amenities
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium">Address</td>
                  {hotels.map(hotel => (
                    <td key={hotel.code} className="py-3 max-w-[200px]">
                      <span className="line-clamp-2">{hotel.address?.content || 'N/A'}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
