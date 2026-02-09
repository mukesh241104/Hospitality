import { NextRequest, NextResponse } from 'next/server';
import { fetchHotelbeds, HotelbedsHotelDetailsResponse } from '@/lib/hotelbeds';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const data = await fetchHotelbeds<HotelbedsHotelDetailsResponse>(
      `/hotel-content-api/1.0/hotels/${code}/details?language=ENG&useSecondaryLanguage=true`
    );

    return NextResponse.json(data.hotel);
  } catch (error) {
    console.error('Hotel details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel details' },
      { status: 500 }
    );
  }
}
