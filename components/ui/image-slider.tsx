"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
    images: { path: string }[];
    name: string;
    className?: string;
}

export function ImageSlider({ images, name, className }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    if (!images || images.length === 0) {
        return (
            <div className={cn("flex aspect-video w-full items-center justify-center rounded-xl bg-muted", className)}>
                <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
            </div>
        );
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const currentImage = images[currentIndex];
    const imageUrl = `https://photos.hotelbeds.com/giata/${currentImage.path}`;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted lg:aspect-[16/10]">
                <Image
                    src={imageUrl}
                    alt={`${name} - Image ${currentIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full opacity-0 shadow-lg transition-opacity group-hover:opacity-100 disabled:opacity-0 lg:opacity-100" // Always visible on desktop for clarity, or use group-hover
                            onClick={prevSlide}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full opacity-0 shadow-lg transition-opacity group-hover:opacity-100 disabled:opacity-0 lg:opacity-100"
                            onClick={nextSlide}
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>

                        {/* Counter Badge */}
                        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all",
                                idx === currentIndex
                                    ? "ring-2 ring-primary ring-offset-2"
                                    : "opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={`https://photos.hotelbeds.com/giata/${img.path}`}
                                alt={`${name} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
