import { NextRequest, NextResponse } from 'next/server';
import { fetchHotelbeds, HotelbedsDestinationsResponse } from '@/lib/hotelbeds';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country') || '';
    const from = searchParams.get('from') || '1';
    const to = searchParams.get('to') || '100';

    const params = new URLSearchParams({
      fields: 'all',
      language: 'ENG',
      from,
      to,
      useSecondaryLanguage: 'true',
    });

    if (country) {
      params.append('countryCodes', country);
    }

    const data = await fetchHotelbeds<HotelbedsDestinationsResponse>(
      `/hotel-content-api/1.0/locations/destinations?${params.toString()}`
    );

    return NextResponse.json({
      destinations: data.destinations || [],
      from: data.from,
      to: data.to,
      total: data.total,
    });
  } catch (error) {
    console.error('Destinations API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch destinations', details: errorMessage },
      { status: 500 }
    );
  }
}
