const express = require("express");
const { createFlight, getFlights, getFlight, updateFlight, deleteFlight, 
createFare, updateFare, deleteFare, 
getFares} = require("../controller/flight");
const flightRouter = express.Router();

flightRouter.post("/", createFlight)
flightRouter.get("/", getFlights)
flightRouter.get("/:id", getFlight)
flightRouter.put("/:id", updateFlight)
flightRouter.delete("/:id", deleteFlight)

flightRouter.post("/:flight_number/fares", createFare);
flightRouter.get("/:id/fares", getFares);
flightRouter.put("/:id/fares", updateFare);
flightRouter.delete("/:id/fares", deleteFare);

module.exports = flightRouter;