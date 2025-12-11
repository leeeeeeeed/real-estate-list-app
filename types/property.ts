export type PropertyType = "apartment" | "officetel" | "villa" | "house" | "commercial"
export type TransactionType = "sale" | "rent" | "monthly-rent"

export interface Property {
  id: string
  title: string
  address: string
  propertyType: PropertyType
  transactionType: TransactionType
  price: number
  deposit?: number
  monthlyRent?: number
  area: number
  floor?: string
  description: string
  coordinates: {
    lat: number
    lng: number
  }
  createdAt: Date
}
