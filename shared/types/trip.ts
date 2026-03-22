import type {Driver} from "#shared/types/driver";
import type {Reservation} from "#shared/types/reservation";
import type {Address} from "#shared/types/address";

export interface Trip {
    id: number
    tripDatetime: string
    availableSeats: number
    smokingAllowed: boolean
    tripStatus: string
    distanceKm: number | null
    durationMinutes: number | null
    createdAt: string
    updatedAt: string
    departureAddress: Address
    arrivingAddress: Address
    driver: Driver
    reservations: Reservation[]
}

export interface TripMinimal {
    id: number
    tripDatetime: string
    availableSeats: number
    smokingAllowed: boolean
    tripStatus: string
    distanceKm: number
    durationMinutes: number
    departureCityName: { id: number; name: string; postalCode: string }
    arrivingCityName:  { id: number; name: string; postalCode: string }
    driver: { id: number; email: string; status: string }
}

export interface TripFilters {
    arrivalCity?: string
    startingCity?: string
    tripDate?: string
    isUpcoming?: boolean
}