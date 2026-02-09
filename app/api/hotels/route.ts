import { NextRequest, NextResponse } from 'next/server';
import { fetchHotelbeds, HotelbedsHotelsResponse } from '@/lib/hotelbeds';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destination = searchParams.get('destination') || '';
    const country = searchParams.get('country') || '';
    const from = searchParams.get('from') || '1';
    const to = searchParams.get('to') || '20';

    // Build query string
    const params = new URLSearchParams({
      fields: 'all',
      language: 'ENG',
      from,
      to,
      useSecondaryLanguage: 'true',
    });

    if (destination) {
      params.append('destinationCode', destination);
    }
    if (country) {
      params.append('countryCode', country);
    }

    const data = await fetchHotelbeds<HotelbedsHotelsResponse>(
      `/hotel-content-api/1.0/hotels?${params.toString()}`
    );

    return NextResponse.json({
      hotels: data.hotels || [],
      from: data.from,
      to: data.to,
      total: data.total,
    });
  } catch (error) {
    console.error('Hotels API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}
