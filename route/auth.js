const express = require("express");
const authRouter = express.Router();
const { register } = require("../controller/auth");

authRouter.post("/register", register);

module.exports = flightRouter;