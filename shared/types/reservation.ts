import type {Person} from "#shared/types/person";
import type {Passenger} from "#shared/types/passenger";
import type { TripMinimal } from "#shared/types/trip"

export interface Reservation {
    id: number
    reservationStatus: string
    createdAt: string
    updatedAt: string
    passenger: Passenger
}

export interface ReservationResponse {
    id: number
    reservationStatus: string
    createdAt: string
    updatedAt: string
    passenger: Person
    trip: TripMinimal
}