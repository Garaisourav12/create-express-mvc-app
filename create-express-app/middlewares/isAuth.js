const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const { getErrorResponse } = require("../utils/commonUtils");

const isAuth = (req, res, next) => {
	const token = req.cookies.token;

	try {
		if (!token) {
			throw new UnauthorizedError("Token not found!");
		}

		const user = jwt.verify(token, process.env.JWT_SECRET);

		if (!user) {
			throw new UnauthorizedError("Invalid token!");
		}

		req.user = user;

		next();
	} catch (error) {
		return res
			.status(error?.statusCode || 500)
			.json(getErrorResponse(error));
	}
};
