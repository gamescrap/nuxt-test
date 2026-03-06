export interface NitroError {
    message: string
    validationErrors?: Record<string, string>
}

export interface ErrorResponse {
    timestamp: string
    status: number
    error: string
    message: string
    instance: string
    validationErrors?: Record<string, string>
}