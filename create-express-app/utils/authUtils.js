const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SALT, JWT_SECRET } = require("../envConfig");

const generateToken = (payload) => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = (token) => {
	return jwt.verify(token, JWT_SECRET);
};

const hashPassword = async (password) => {
	return await bcrypt.hashSync(password, SALT);
};

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };
