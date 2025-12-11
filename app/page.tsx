"use client"

import { useState, useMemo } from "react"
import type { Property } from "@/types/property"
import { PropertyMap } from "@/components/property-map"
import { PropertyList } from "@/components/property-list"
import { AddPropertyDialog } from "@/components/add-property-dialog"
import { PropertyDetailDialog } from "@/components/property-detail-dialog"
import { Input } from "@/components/ui/input"

const initialProperties: Property[] = [
  {
    id: "1",
    title: "강남역 신축 오피스텔",
    address: "서울시 강남구 테헤란로 123",
    propertyType: "officetel",
    transactionType: "monthly-rent",
    price: 5000,
    deposit: 5000,
    monthlyRent: 50,
    area: 33,
    floor: "12층",
    description: "역세권 신축 오피스텔",
    coordinates: { lat: 37.497, lng: 127.028 },
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "판교 아파트",
    address: "경기도 성남시 분당구 판교역로 230",
    propertyType: "apartment",
    transactionType: "sale",
    price: 120000,
    area: 84,
    floor: "15층",
    description: "판교 신도시 아파트",
    coordinates: { lat: 37.395, lng: 127.112 },
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    title: "여의도 오피스빌딩",
    address: "서울시 영등포구 여의대로 108",
    propertyType: "commercial",
    transactionType: "rent",
    price: 50000,
    area: 150,
    floor: "전층",
    description: "여의도 핵심상권 오피스",
    coordinates: { lat: 37.521, lng: 126.924 },
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "4",
    title: "강남역 신축 아파트",
    address: "서울시 강남구 역삼동 456",
    propertyType: "apartment",
    transactionType: "sale",
    price: 150000,
    area: 99,
    floor: "20층",
    description: "강남역 도보 5분 신축 아파트",
    coordinates: { lat: 37.499, lng: 127.03 },
    createdAt: new Date("2024-02-10"),
  },
]

export default function PropertyManagementPage() {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [detailProperty, setDetailProperty] = useState<Property | null>(null)

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties

    const query = searchQuery.toLowerCase()
    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query),
    )
  }, [properties, searchQuery])

  const handleAddProperty = (propertyData: Omit<Property, "id" | "createdAt">) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setProperties([newProperty, ...properties])
  }

  const handleDeleteProperty = (id: string) => {
    if (confirm("이 매물을 삭제하시겠습니까?")) {
      setProperties(properties.filter((p) => p.id !== id))
      if (selectedPropertyId === id) {
        setSelectedPropertyId(undefined)
      }
      if (detailProperty?.id === id) {
        setDetailProperty(null)
      }
    }
  }

  const handleMapMarkerClick = (property: Property) => {
    setSelectedPropertyId(property.id)
  }

  const handleListItemClick = (property: Property) => {
    setSelectedPropertyId(property.id)
    setDetailProperty(property)
  }

  const handleUpdateProperty = (id: string, data: Omit<Property, "id" | "createdAt">) => {
    setProperties(properties.map((p) => (p.id === id ? { ...p, ...data } : p)))
    const updatedProperty = properties.find((p) => p.id === id)
    if (updatedProperty) {
      setDetailProperty({ ...updatedProperty, ...data })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">매물 관리 시스템</h1>
                <p className="text-sm text-muted-foreground">부동산 중개사 관리 도구</p>
              </div>
            </div>
            <AddPropertyDialog onAdd={handleAddProperty} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Map Section */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">매물 지도</h2>
                <span className="text-sm text-muted-foreground">
                  총 <span className="font-semibold text-primary">{filteredProperties.length}</span>개 매물
                </span>
              </div>
              <div className="h-[600px]">
                <PropertyMap
                  properties={filteredProperties}
                  onPropertyClick={handleMapMarkerClick}
                  selectedPropertyId={selectedPropertyId}
                />
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">매물 목록</h2>
              <p className="text-sm text-muted-foreground mt-1">등록된 매물을 확인하고 관리하세요</p>
            </div>

            <div className="mb-4">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  type="text"
                  placeholder="매물 검색 (예: 강남역, 신축, 아파트)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  <span className="font-semibold text-primary">{filteredProperties.length}</span>개의 검색 결과
                </p>
              )}
            </div>

            <PropertyList
              properties={filteredProperties}
              onPropertyClick={handleListItemClick}
              onPropertyDelete={handleDeleteProperty}
              selectedPropertyId={selectedPropertyId}
            />
          </div>
        </div>
      </div>

      <PropertyDetailDialog
        property={detailProperty}
        open={!!detailProperty}
        onOpenChange={(open) => {
          if (!open) {
            setDetailProperty(null)
            setSelectedPropertyId(undefined)
          }
        }}
        onUpdate={handleUpdateProperty}
      />
    </main>
  )
}
