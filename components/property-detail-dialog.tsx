"use client"

import { useState } from "react"
import type { Property } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PropertyDetailDialogProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, data: Omit<Property, "id" | "createdAt">) => void
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

export function PropertyDetailDialog({ property, open, onOpenChange, onUpdate }: PropertyDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Omit<Property, "id" | "createdAt">>({
    title: "",
    address: "",
    propertyType: "apartment",
    transactionType: "sale",
    price: 0,
    area: 0,
    description: "",
    coordinates: { lat: 37.5, lng: 127.0 },
  })

  const handleEdit = () => {
    if (property) {
      setFormData({
        title: property.title,
        address: property.address,
        propertyType: property.propertyType,
        transactionType: property.transactionType,
        price: property.price,
        deposit: property.deposit,
        monthlyRent: property.monthlyRent,
        area: property.area,
        floor: property.floor,
        description: property.description,
        coordinates: property.coordinates,
      })
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (property) {
      onUpdate(property.id, formData)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000)
      const remainder = price % 10000
      return remainder > 0 ? `${billion}억 ${remainder}만` : `${billion}억`
    }
    return `${price}만`
  }

  if (!property) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>매물 상세 정보</DialogTitle>
          <DialogDescription>
            {isEditing ? "매물 정보를 수정할 수 있습니다" : "매물 정보를 확인하거나 수정하세요"}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">매물명</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="예: 강남역 신축 오피스텔"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">주소</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="예: 서울시 강남구 테헤란로 123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-property-type">매물 유형</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, propertyType: value as Property["propertyType"] })
                  }
                >
                  <SelectTrigger id="edit-property-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(propertyTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-transaction-type">거래 유형</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, transactionType: value as Property["transactionType"] })
                  }
                >
                  <SelectTrigger id="edit-transaction-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(transactionTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">
                  {formData.transactionType === "monthly-rent" ? "보증금 (만원)" : "가격 (만원)"}
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              {formData.transactionType === "monthly-rent" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-monthly-rent">월세 (만원)</Label>
                  <Input
                    id="edit-monthly-rent"
                    type="number"
                    value={formData.monthlyRent || 0}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-area">면적 (㎡)</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-floor">층</Label>
                <Input
                  id="edit-floor"
                  value={formData.floor || ""}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  placeholder="예: 12층"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">상세 설명</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="매물에 대한 상세한 설명을 입력하세요"
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button onClick={handleSave}>저장</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                {propertyTypeLabels[property.propertyType]}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent">
                {transactionTypeLabels[property.transactionType]}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-balance">{property.title}</h3>
              <p className="text-muted-foreground">{property.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">가격</p>
                <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
              </div>
              {property.transactionType === "monthly-rent" && property.deposit && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">보증금</p>
                  <p className="text-xl font-bold text-foreground">{formatPrice(property.deposit)}</p>
                </div>
              )}
              {property.transactionType === "monthly-rent" && property.monthlyRent && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">월세</p>
                  <p className="text-xl font-bold text-foreground">{property.monthlyRent}만원</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">면적</p>
                <p className="text-lg font-semibold text-foreground">{property.area}㎡</p>
              </div>
              {property.floor && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">층</p>
                  <p className="text-lg font-semibold text-foreground">{property.floor}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">상세 설명</p>
              <p className="text-foreground leading-relaxed">{property.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">위치 좌표</p>
              <p className="text-sm font-mono text-foreground">
                위도: {property.coordinates.lat}, 경도: {property.coordinates.lng}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">등록일</p>
              <p className="text-sm text-foreground">{property.createdAt.toLocaleDateString("ko-KR")}</p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
              <Button onClick={handleEdit}>수정</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
