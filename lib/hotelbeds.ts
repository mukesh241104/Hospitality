import crypto from 'crypto';

// Hotelbeds API Configuration
const API_KEY = process.env.HOTELBEDS_API_KEY!;
const API_SECRET = process.env.HOTELBEDS_API_SECRET!;
const API_ENDPOINT = process.env.HOTELBEDS_ENDPOINT || 'https://api.test.hotelbeds.com';

/**
 * Generate X-Signature header for Hotelbeds API
 * SHA256 hash of: apiKey + secret + timestamp (in seconds)
 */
function generateSignature(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureRaw = `${API_KEY}${API_SECRET}${timestamp}`;
  return crypto.createHash('sha256').update(signatureRaw).digest('hex');
}

/**
 * Get authentication headers for Hotelbeds API
 */
export function getHotelbedsHeaders(): HeadersInit {
  return {
    'Api-key': API_KEY,
    'X-Signature': generateSignature(),
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
  };
}

/**
 * Fetch from Hotelbeds API with authentication
 */
export async function fetchHotelbeds<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_ENDPOINT}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHotelbedsHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hotelbeds API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Type definitions for Hotelbeds API responses

export interface HotelbedsHotel {
  code: number;
  name: {
    content: string;
  };
  description?: {
    content: string;
  };
  countryCode: string;
  destinationCode: string;
  zoneCode: number;
  coordinates?: {
    longitude: number;
    latitude: number;
  };
  category?: {
    code: string;
    description?: {
      content: string;
    };
  };
  categoryGroup?: {
    code: string;
    description?: {
      content: string;
    };
  };
  accommodationType?: {
    code: string;
    typeDescription?: string;
  };
  address?: {
    content: string;
  };
  city?: {
    content: string;
  };
  email?: string;
  phones?: Array<{
    phoneNumber: string;
    phoneType: string;
  }>;
  images?: Array<{
    path: string;
    type: {
      code: string;
      description?: {
        content: string;
      };
    };
  }>;
  facilities?: Array<{
    facilityCode: number;
    facilityGroupCode: number;
    description?: {
      content: string;
    };
  }>;
  ranking?: number;
  web?: string;
}

export interface HotelbedsHotelsResponse {
  hotels: HotelbedsHotel[];
  from: number;
  to: number;
  total: number;
}

export interface HotelbedsHotelDetailsResponse {
  hotel: HotelbedsHotel;
}

export interface HotelbedsDestination {
  code: string;
  name: {
    content: string;
  };
  countryCode: string;
  isoCode?: string;
  zones?: Array<{
    zoneCode: number;
    name: string;
  }>;
}

export interface HotelbedsDestinationsResponse {
  destinations: HotelbedsDestination[];
  from: number;
  to: number;
  total: number;
}
