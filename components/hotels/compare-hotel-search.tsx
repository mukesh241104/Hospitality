'use client';

import { useState } from 'react';
import { useHotels } from '@/contexts/hotel-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Loader2, Check } from 'lucide-react';
import { HotelbedsHotel, HotelbedsHotelsResponse } from '@/lib/hotelbeds';
import { Card } from '@/components/ui/card';

export function CompareHotelSearch() {
    const { selectedHotels, addToCompare } = useHotels();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<HotelbedsHotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);
        try {
            // Search by name (keyword)
            const params = new URLSearchParams({
                name: query,
                from: '1',
                to: '5', // Limit results for this quick add
            });

            const response = await fetch(`/api/hotels?${params.toString()}`);
            const data: HotelbedsHotelsResponse = await response.json();
            setResults(data.hotels || []);
        } catch (error) {
            console.error('Failed to search hotels:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const isSelected = (code: number) => selectedHotels.some(h => h.code === code);
    const isFull = selectedHotels.length >= 4;

    if (isFull) {
        return (
            <Card className="p-4 bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                    Comparison list is full (max 4 hotels). Remove a hotel to add another.
                </p>
            </Card>
        );
    }

    return (
        <Card className="p-4 space-y-4">
            <div className="space-y-2">
                <Label>Add another hotel to compare</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search hotel by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading || !query.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {hasSearched && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Results</Label>
                    {results.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No hotels found matching "{query}"</p>
                    ) : (
                        <div className="grid gap-2">
                            {results.map((hotel) => {
                                const selected = isSelected(hotel.code);
                                return (
                                    <div key={hotel.code} className="flex items-center justify-between p-2 rounded-md border bg-card">
                                        <div className="min-w-0 flex-1 mr-2">
                                            <p className="text-sm font-medium truncate">{hotel.name?.content}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {hotel.city?.content}, {hotel.countryCode}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={selected ? "secondary" : "default"}
                                            disabled={selected}
                                            onClick={() => addToCompare(hotel)}
                                        >
                                            {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
