const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { SALT } = require("../config/envConfig");
const { BadRequestError, InternalServerError } = require("../errors");
const { dataMissing } = require("../utils/commonUtils");

const createUser = async ({ username, email, password }) => {
	if (dataMissing(username, email, password)) {
		throw new BadRequestError("All fields are required.");
	}

	try {
		let userAlreadyExists = null;

		userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			throw new BadRequestError("Email already exists.");
		}

		userAlreadyExists = await User.findOne({ username });
		if (userAlreadyExists) {
			throw new BadRequestError("Username already exists.");
		}

		const hashedPassword = await bcrypt.hash(password, SALT);

		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();

		if (!newUser) {
			throw new BadRequestError("Registration failed!");
		}

		return newUser;
	} catch (error) {
		throw new InternalServerError("Internal Server Error!");
	}
};

module.exports = { createUser };
