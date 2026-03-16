export interface Brand {
    id: number
    name: string
}

export interface Vehicle {
    id: number
    model: string
    seats: number
    plate: string
    description: string
    brand: Brand
}

export interface VehicleRequest {
    seats: number
    model: string
    description: string
    plate: string
    brandId: number
}