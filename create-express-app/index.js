const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// File Imports
const { PORT } = require("./envConfig");
const connectDB = require("./db");
const routes = require("./routes");
const { NotFoundError } = require("./errors");

// Constants
const app = express();
const corsOptions = {
	origin: true,
	methods: "*",
	credentials: true,
};
const port = PORT || 5000;

// Global Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Db Connection
connectDB();

// Entry Point
app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Routes
app.use("/api", routes);

// Handler for 404 errors
app.use((req, res) => {
	try {
		throw new NotFoundError(`Cannot ${req.method} ${req.url}`);
	} catch (err) {
		return res.status(err.statusCode).json({
			message: err.message,
			error: "Not Found",
			statusCode: err.statusCode,
		});
	}
});

// Server Start
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	console.log(`http://localhost:${port}`);
});
