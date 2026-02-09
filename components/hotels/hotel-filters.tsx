'use client';

import { useState, useEffect } from 'react';
import { useHotels } from '@/contexts/hotel-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X, MapPin } from 'lucide-react';

interface Destination {
  code: string;
  name: { content: string };
  countryCode: string;
}

export function HotelFilters() {
  const { filters, setFilters, searchHotels, loading } = useHotels();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const response = await fetch('/api/destinations?from=1&to=100');
        const data = await response.json();
        setDestinations(data.destinations || []);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(dest =>
    dest.name?.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDestination = (dest: Destination) => {
    setFilters({
      ...filters,
      destination: dest.code,
      destinationName: dest.name?.content || dest.code,
    });
    setSearchQuery(dest.name?.content || dest.code);
    setShowDropdown(false);
  };

  const handleClearFilters = () => {
    setFilters({
      destination: '',
      destinationName: '',
      country: '',
    });
    setSearchQuery('');
  };

  const handleSearch = () => {
    searchHotels(false);
  };

  const hasFilters = filters.destination || filters.country;

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Search Hotels</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Destination search */}
        <div className="relative">
          <Label htmlFor="destination" className="mb-2 block text-sm font-medium">
            Destination
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="destination"
              placeholder={loadingDestinations ? "Loading destinations..." : "Search destinations..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="pl-10"
              disabled={loadingDestinations}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && searchQuery && filteredDestinations.length > 0 && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-lg">
              {filteredDestinations.slice(0, 10).map((dest) => (
                <button
                  key={dest.code}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => handleSelectDestination(dest)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{dest.name?.content || dest.code}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{dest.countryCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Country filter */}
        <div>
          <Label htmlFor="country" className="mb-2 block text-sm font-medium">
            Country Code
          </Label>
          <Input
            id="country"
            placeholder="e.g., US, ES, GB"
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value.toUpperCase() })}
            maxLength={2}
          />
        </div>

        {/* Search button */}
        <Button
          className="w-full"
          onClick={handleSearch}
          disabled={loading}
        >
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Searching...' : 'Search Hotels'}
        </Button>
      </div>
    </div>
  );
}
