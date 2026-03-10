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