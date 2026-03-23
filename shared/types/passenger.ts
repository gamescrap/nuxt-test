export interface PassengerProfile {
    firstname: string
    lastname: string
    phone: string
    birthday: string
    updatedAt: string
}

export interface Passenger {
    id: number
    email: string
    status: string
    createdAt: string
    profile?: PassengerProfile
    roles: string[]
}