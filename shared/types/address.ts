import type {City} from "#shared/types/city";

export interface Address {
    id: number
    streetNumber: string
    streetName: string
    latitude: number
    longitude: number
    validated: boolean
    city: City
}