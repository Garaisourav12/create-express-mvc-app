const express = require("express");
const v1ApiRouter = express.Router();

// Import Routes
const userRoutes = require("./userRouter");

// Use Routes
v1ApiRouter.use("/users", userRoutes);

module.exports = v1ApiRouter;
