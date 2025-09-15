const express = require("express");
const { createFlight, getFlights, getFlight } = require("../controller/flight");
const flightRouter = express.Router();

flightRouter.post("/", createFlight)
flightRouter.get("/", getFlights)
flightRouter.get("/:id", getFlight)
flightRouter.put("/:id", getFlight)

module.exports = flightRouter;