"use client"

import { useRef, useEffect } from "react"
import type { Property } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface PropertyListProps {
  properties: Property[]
  onPropertyClick: (property: Property) => void
  onPropertyDelete: (id: string) => void
  selectedPropertyId?: string
}

const propertyTypeLabels: Record<Property["propertyType"], string> = {
  apartment: "아파트",
  officetel: "오피스텔",
  villa: "빌라",
  house: "단독주택",
  commercial: "상가",
}

const transactionTypeLabels: Record<Property["transactionType"], string> = {
  sale: "매매",
  rent: "전세",
  "monthly-rent": "월세",
}

export function PropertyList({ properties, onPropertyClick, onPropertyDelete, selectedPropertyId }: PropertyListProps) {
  const listItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    if (selectedPropertyId && listItemRefs.current[selectedPropertyId]) {
      listItemRefs.current[selectedPropertyId]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [selectedPropertyId])

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000)
      const remainder = price % 10000
      return remainder > 0 ? `${billion}억 ${remainder}만` : `${billion}억`
    }
    return `${price}만`
  }

  return (
    <div className="space-y-3">
      {properties.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-muted-foreground">등록된 매물이 없습니다</p>
          </div>
        </Card>
      ) : (
        properties.map((property) => (
          <Card
            key={property.id}
            ref={(el) => (listItemRefs.current[property.id] = el)}
            className={`p-4 transition-all cursor-pointer hover:shadow-md ${
              selectedPropertyId === property.id ? "ring-2 ring-primary shadow-md" : ""
            }`}
            onClick={() => onPropertyClick(property)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                    {propertyTypeLabels[property.propertyType]}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent">
                    {transactionTypeLabels[property.transactionType]}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-1 text-balance">{property.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{property.address}</p>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">가격:</span>
                    <span className="font-semibold text-foreground">{formatPrice(property.price)}</span>
                  </div>
                  {property.transactionType === "monthly-rent" && property.deposit && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">보증금:</span>
                      <span className="font-medium text-foreground">{formatPrice(property.deposit)}</span>
                    </div>
                  )}
                  {property.transactionType === "monthly-rent" && property.monthlyRent && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">월세:</span>
                      <span className="font-medium text-foreground">{property.monthlyRent}만</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">면적:</span>
                    <span className="font-medium text-foreground">{property.area}㎡</span>
                  </div>
                  {property.floor && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">층:</span>
                      <span className="font-medium text-foreground">{property.floor}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onPropertyDelete(property.id)
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
