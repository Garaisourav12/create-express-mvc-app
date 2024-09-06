const HttpError = require("./httpError");

// Internal Server Error
class InternalServerError extends HttpError {
	constructor(message) {
		super(500, message);
	}
}

module.exports = { InternalServerError };
