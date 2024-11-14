export const ErrorTypes = {
    /** Errors stemming from the database */
    DB_ERROR: "database_error",
    DUPLICATE_ERROR: "duplicate_error",
    INVALID_ARGUMENT: "invalid_argument",
    INVALID_DATA: "invalid_data",
    UNAUTHORIZED: "unauthorized",
    NOT_FOUND: "not_found",
    NOT_ALLOWED: "not_allowed",
    UNEXPECTED_STATE: "unexpected_state",
    CONFLICT: "conflict",
}

class BaseError extends Error {
    public static Types = ErrorTypes
    public type: string
    public message: string
    public code?: string
    public date: Date

    /**
     * Creates a standardized error to be used across Medusa project.
     * @param {string} type - type of error
     * @param {string} message - message to go along with error
     * @param {string} code - code of error
     * @param {Array} params - params
     */
    constructor(type: string, message: string, code?: string, ...params: any) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BaseError)
        }

        this.type = type
        this.code = code
        this.message = message
        this.date = new Date()
    }
}

export default BaseError
