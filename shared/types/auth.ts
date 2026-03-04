export interface AuthResponse {
    token: string
    type: string
    refreshToken: string
    userId: number
    roles: string[]
}

export interface ErrorResponse {
    timestamp: string
    status: number
    error: string
    message: string
    instance: string
    validationErrors?: Record<string, string>
}