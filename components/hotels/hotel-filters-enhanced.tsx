"use client";

import { useState, useEffect } from "react";
import { useHotels } from "@/contexts/hotel-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Search, X, Filter, Loader2 } from "lucide-react";

interface Destination {
  code: string;
  name: { content: string };
  countryCode: string;
}

export function HotelFiltersEnhanced() {
  const { filters, setFilters, searchHotels, loading } = useHotels();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState(filters.destinationName || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoadingDestinations(true);
      try {
        const response = await fetch("/api/destinations?limit=100");
        const data = await response.json();
        setDestinations(data.destinations || []);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(
    (dest) =>
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

  const handleClearDestination = () => {
    setFilters({ ...filters, destination: "", destinationName: "" });
    setSearchQuery("");
  };

  const handleSearch = () => {
    searchHotels(false);
  };

  const activeFiltersCount = [filters.destination, filters.country].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({ destination: "", destinationName: "", country: "" });
              setSearchQuery("");
            }}
            className="h-8 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* Destination Search */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Destination</Label>
        <div className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={handleClearDestination}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
              <ScrollArea className="max-h-64">
                {loadingDestinations ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredDestinations.length > 0 ? (
                  <div className="p-1">
                    {filteredDestinations.slice(0, 20).map((dest) => (
                      <button
                        key={dest.code}
                        onClick={() => handleSelectDestination(dest)}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{dest.name?.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {dest.countryCode} • {dest.code}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No destinations found
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
        {filters.destination && (
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            {filters.destinationName}
            <button onClick={handleClearDestination}>
              <X className="h-3 w-3 ml-1" />
            </button>
          </Badge>
        )}
      </div>

      {/* Country Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Country Code</Label>
        <Select
          value={filters.country}
          onValueChange={(value) => setFilters({ ...filters, country: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            <SelectItem value="ES">Spain (ES)</SelectItem>
            <SelectItem value="US">United States (US)</SelectItem>
            <SelectItem value="GB">United Kingdom (GB)</SelectItem>
            <SelectItem value="FR">France (FR)</SelectItem>
            <SelectItem value="IT">Italy (IT)</SelectItem>
            <SelectItem value="DE">Germany (DE)</SelectItem>
            <SelectItem value="PT">Portugal (PT)</SelectItem>
            <SelectItem value="GR">Greece (GR)</SelectItem>
            <SelectItem value="TH">Thailand (TH)</SelectItem>
            <SelectItem value="MX">Mexico (MX)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Search Button */}
      <Button onClick={handleSearch} disabled={loading} className="w-full gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Search Hotels
          </>
        )}
      </Button>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
