import type {Passenger} from "#shared/types/passenger";

export interface Reservation {
    id: number
    reservationStatus: string
    createdAt: string
    updatedAt: string
    passenger: Passenger
}