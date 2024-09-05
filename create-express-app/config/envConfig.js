const dotenv = require("dotenv");

dotenv.config();

// Export all environment variables from .env file
module.exports = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	SALT: Number(process.env.SALT),
};
