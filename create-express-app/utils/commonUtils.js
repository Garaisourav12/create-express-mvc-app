const HttpError = require("../errors/httpError");

const dataMissing = (...data) => {
	return data.some((item) => item === undefined || item === null);
};

const getErrorResponse = (error) => {
	if (error instanceof HttpError) {
		return {
			success: false,
			error: "Internal Server Error!",
			statusCode: error?.statusCode || 500,
		};
	}
	return {
		success: false,
		error: error.message,
		statusCode: error?.statusCode,
	};
};

module.exports = { dataMissing, getErrorResponse };
