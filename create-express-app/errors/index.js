const HttpError = require("./HttpError");
const ClientError = require("./4XX");
const ServerError = require("./5XX");

module.exports = {
	HttpError,
	...ClientError,
	...ServerError,
};
