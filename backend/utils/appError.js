class AppError extends Error {
    constructor(message, statusCode) {
        super(message) // Call the parent constructor with the message
        this.statusCode = statusCode || 500 // Default to 500 if no status code provided
        this.status = `${statusCode}`.startsWith(4) ? "failed": "error" // Set the status based on the status code
        this.isOperational = true // Indicates that it's an expected operational error (e.g., validation)
        Error.captureStackTrace(this, this.constructor) //Capture the stack trace for debugging
    }
}

module.exports = AppError

