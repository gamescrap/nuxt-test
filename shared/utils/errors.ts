import type { NitroError } from "../types/errors"

export const getErrorMessage = (e: unknown, fallback = 'Une erreur est survenue.'): string => {
    const nitroError = (e as any)?.data?.data as NitroError
    return nitroError?.message ?? fallback
}

export const getValidationErrors = (e: unknown): Record<string, string> => {
    const nitroError = (e as any)?.data?.data as NitroError
    return nitroError?.validationErrors ?? {}
}