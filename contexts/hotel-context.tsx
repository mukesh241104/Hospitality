'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HotelbedsHotel } from '@/lib/hotelbeds';

interface HotelFilters {
  destination: string;
  destinationName: string;
  country: string;
  name: string;
  category: string;
}

interface HotelContextType {
  // Search results
  hotels: HotelbedsHotel[];
  setHotels: (hotels: HotelbedsHotel[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Pagination
  from: number;
  to: number;
  total: number;
  setPagination: (from: number, to: number, total: number) => void;

  // Filters
  filters: HotelFilters;
  setFilters: (filters: HotelFilters) => void;

  // Comparison
  selectedHotels: HotelbedsHotel[];
  addToCompare: (hotel: HotelbedsHotel) => void;
  removeFromCompare: (hotelCode: number) => void;
  isSelected: (hotelCode: number) => boolean;
  clearComparison: () => void;

  // Search action
  searchHotels: (append?: boolean) => Promise<void>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEY = 'hospitality_selected_hotels';
const MAX_COMPARE = 4;

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const [hotels, setHotels] = useState<HotelbedsHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<HotelFilters>({
    destination: '',
    destinationName: '',
    country: '',
    name: '',
    category: '',
  });
  const [selectedHotels, setSelectedHotels] = useState<HotelbedsHotel[]>([]);

  // Load selected hotels from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setSelectedHotels(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved hotels:', e);
        }
      }
    }
  }, []);

  // Save selected hotels to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedHotels));
    }
  }, [selectedHotels]);

  const setPagination = useCallback((newFrom: number, newTo: number, newTotal: number) => {
    setFrom(newFrom);
    setTo(newTo);
    setTotal(newTotal);
  }, []);

  const searchHotels = useCallback(async (append = false) => {
    setLoading(true);
    try {
      const searchFrom = append ? to + 1 : 1;
      const searchTo = append ? to + 20 : 20;

      const params = new URLSearchParams({
        from: searchFrom.toString(),
        to: searchTo.toString(),
      });

      if (filters.destination) {
        params.append('destination', filters.destination);
      }
      if (filters.country) {
        params.append('country', filters.country);
      }
      if (filters.name) {
        params.append('name', filters.name);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }

      const response = await fetch(`/api/hotels?${params.toString()}`);
      const data = await response.json();

      if (append) {
        setHotels(prev => [...prev, ...(data.hotels || [])]);
      } else {
        setHotels(data.hotels || []);
      }

      setPagination(data.from || 1, data.to || 20, data.total || 0);
    } catch (error) {
      console.error('Failed to search hotels:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, to, setPagination]);

  const addToCompare = useCallback((hotel: HotelbedsHotel) => {
    setSelectedHotels(prev => {
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      if (prev.some(h => h.code === hotel.code)) {
        return prev;
      }
      return [...prev, hotel];
    });
  }, []);

  const removeFromCompare = useCallback((hotelCode: number) => {
    setSelectedHotels(prev => prev.filter(h => h.code !== hotelCode));
  }, []);

  const isSelected = useCallback((hotelCode: number) => {
    return selectedHotels.some(h => h.code === hotelCode);
  }, [selectedHotels]);

  const clearComparison = useCallback(() => {
    setSelectedHotels([]);
  }, []);

  return (
    <HotelContext.Provider
      value={{
        hotels,
        setHotels,
        loading,
        setLoading,
        from,
        to,
        total,
        setPagination,
        filters,
        setFilters,
        selectedHotels,
        addToCompare,
        removeFromCompare,
        isSelected,
        clearComparison,
        searchHotels,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export function useHotels() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotels must be used within a HotelProvider');
  }
  return context;
}
