export interface AuthResponse {
    token: string
    type: string
    refreshToken: string
    userId: number
    roles: string[]
    exp?: number
}