export interface Person {
    id: number
    email: string
    status: string
    createdAt: string
    profile?: PersonProfile
    roles: string[]
}

export interface PersonProfile {
    firstname: string
    lastname: string
    phone: string
    birthday: string
    updatedAt: string
}

export type UpdatePersonRequest = Omit<PersonProfile, 'updatedAt'>