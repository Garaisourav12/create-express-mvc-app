const HttpError = require("./httpError");

// Bad Request
class BadRequestError extends HttpError {
	constructor(message) {
		super(400, message);
	}
}

// Not Found
class NotFoundError extends HttpError {
	constructor(message) {
		super(404, message);
	}
}

// Unauthorized
class UnauthorizedError extends HttpError {
	constructor(message) {
		super(401, message);
	}
}

// Forbidden
class ForbiddenError extends HttpError {
	constructor(message) {
		super(403, message);
	}
}

// Conflict
class ConflictError extends HttpError {
	constructor(message) {
		super(409, message);
	}
}

module.exports = {
	BadRequestError,
	NotFoundError,
	UnauthorizedError,
	ForbiddenError,
	ConflictError,
};
