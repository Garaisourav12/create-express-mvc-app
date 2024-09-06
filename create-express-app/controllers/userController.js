const { createUser } = require("../services/user");
const { getErrorResponse } = require("../utils/commonUtils");

const registerUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const user = await createUser({ username, email, password });
		res.status(201).json({
			success: true,
			message: "Registration successful!",
			data: user,
			statusCode: 201,
		});
	} catch (error) {
		return res
			.status(error?.statusCode || 500)
			.json(getErrorResponse(error));
	}
};

module.exports = { registerUser };
