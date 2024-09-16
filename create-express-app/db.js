const mongoose = require("mongoose");
const { MONGO_URI } = require("./envConfig");

const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected");
	} catch (err) {
		console.error(err.message);
	}
};

module.exports = connectDB;
