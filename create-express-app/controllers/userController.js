const { createUser } = require("../views/user");

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
		res.status(error.statusCode).json({
			success: false,
			error: error.message,
			statusCode: error.statusCode,
		});
	}
};

module.exports = { registerUser };
