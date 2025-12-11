"use client"

import type React from "react"

import { useState } from "react"
import type { Property, PropertyType, TransactionType } from "@/types/property"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddPropertyDialogProps {
  onAdd: (property: Omit<Property, "id" | "createdAt">) => void
}

export function AddPropertyDialog({ onAdd }: AddPropertyDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    propertyType: "apartment" as PropertyType,
    transactionType: "sale" as TransactionType,
    price: "",
    deposit: "",
    monthlyRent: "",
    area: "",
    floor: "",
    description: "",
    lat: "",
    lng: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const property: Omit<Property, "id" | "createdAt"> = {
      title: formData.title,
      address: formData.address,
      propertyType: formData.propertyType,
      transactionType: formData.transactionType,
      price: Number(formData.price),
      deposit: formData.deposit ? Number(formData.deposit) : undefined,
      monthlyRent: formData.monthlyRent ? Number(formData.monthlyRent) : undefined,
      area: Number(formData.area),
      floor: formData.floor || undefined,
      description: formData.description,
      coordinates: {
        lat: formData.lat ? Number(formData.lat) : 37.5 + Math.random() * 0.1,
        lng: formData.lng ? Number(formData.lng) : 127.0 + Math.random() * 0.1,
      },
    }

    onAdd(property)
    setOpen(false)
    setFormData({
      title: "",
      address: "",
      propertyType: "apartment",
      transactionType: "sale",
      price: "",
      deposit: "",
      monthlyRent: "",
      area: "",
      floor: "",
      description: "",
      lat: "",
      lng: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          매물 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 매물 등록</DialogTitle>
          <DialogDescription>관리할 매물 정보를 입력해주세요</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">매물명 *</Label>
              <Input
                id="title"
                placeholder="예: 강남역 신축 오피스텔"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">주소 *</Label>
              <Input
                id="address"
                placeholder="예: 서울시 강남구 테헤란로 123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="propertyType">매물 종류 *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value: PropertyType) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">아파트</SelectItem>
                    <SelectItem value="officetel">오피스텔</SelectItem>
                    <SelectItem value="villa">빌라</SelectItem>
                    <SelectItem value="house">단독주택</SelectItem>
                    <SelectItem value="commercial">상가</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transactionType">거래 유형 *</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value: TransactionType) => setFormData({ ...formData, transactionType: value })}
                >
                  <SelectTrigger id="transactionType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">매매</SelectItem>
                    <SelectItem value="rent">전세</SelectItem>
                    <SelectItem value="monthly-rent">월세</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  {formData.transactionType === "monthly-rent" ? "보증금 (만원) *" : "가격 (만원) *"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="30000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              {formData.transactionType === "monthly-rent" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="deposit">보증금 (만원)</Label>
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="5000"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="monthlyRent">월세 (만원)</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      placeholder="50"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">면적 (㎡) *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="84"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="floor">층수</Label>
                <Input
                  id="floor"
                  placeholder="예: 5층"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Input
                id="description"
                placeholder="매물에 대한 간단한 설명"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lat">위도 (선택)</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.000001"
                  placeholder="37.5"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lng">경도 (선택)</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.000001"
                  placeholder="127.0"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              등록하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
