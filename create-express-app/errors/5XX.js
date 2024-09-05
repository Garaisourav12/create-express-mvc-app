const HttpError = require("./HttpError");

// Internal Server Error
class InternalServerError extends HttpError {
	constructor(message) {
		super(500, message);
	}
}

module.exports = { InternalServerError };
