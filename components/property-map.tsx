"use client"

import { useEffect, useRef } from "react"
import type { Property } from "@/types/property"

interface PropertyMapProps {
  properties: Property[]
  onPropertyClick: (property: Property) => void
  selectedPropertyId?: string
}

declare global {
  interface Window {
    naver: any
  }
}

export function PropertyMap({ properties, onPropertyClick, selectedPropertyId }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const naverMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || !window.naver) return

    // Create map centered on Seoul
    const mapOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.978),
      zoom: 12,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    }

    naverMapRef.current = new window.naver.maps.Map(mapRef.current, mapOptions)
  }, [])

  useEffect(() => {
    if (!naverMapRef.current || !window.naver) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Create new markers
    properties.forEach((property) => {
      const position = new window.naver.maps.LatLng(property.coordinates.lat, property.coordinates.lng)

      const marker = new window.naver.maps.Marker({
        position,
        map: naverMapRef.current,
        title: property.title,
        icon: {
          content: `
            <div class="relative">
              <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                property.id === selectedPropertyId
                  ? "bg-blue-600 scale-125"
                  : "bg-white border-2 border-blue-600 hover:scale-110"
              }">
                <svg class="w-5 h-5 ${property.id === selectedPropertyId ? "text-white" : "text-blue-600"}" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          `,
          anchor: new window.naver.maps.Point(20, 40),
        },
      })

      // Add click event to marker
      window.naver.maps.Event.addListener(marker, "click", () => {
        onPropertyClick(property)
      })

      markersRef.current.push(marker)
    })

    // Pan to selected property
    if (selectedPropertyId) {
      const selectedProperty = properties.find((p) => p.id === selectedPropertyId)
      if (selectedProperty) {
        const position = new window.naver.maps.LatLng(
          selectedProperty.coordinates.lat,
          selectedProperty.coordinates.lng,
        )
        naverMapRef.current.panTo(position)
      }
    }
  }, [properties, onPropertyClick, selectedPropertyId])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg z-10">
        <p className="text-xs font-medium text-foreground mb-2">매물 현황</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>{properties.length}개 매물</span>
        </div>
      </div>
    </div>
  )
}
