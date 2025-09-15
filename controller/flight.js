const { StatusCodes } = require('http-status-codes');
const customError = require('../error/');
const Flight = require('../model/flight');

exports.createFlight = async(req, res) => { 

    const max = 1000;
    const randomInt = Math.floor(Math.random() * (1000 + 1));
    const seconds = Math.floor(Date.now() / 1000);
    const flight_number = `FL-${randomInt}` + seconds;

    const { aircraftId, departure, arrival, departureTime, arrivalTime } = req.body || ''

    if(!aircraftId || !departure || !arrival || !departureTime || !arrivalTime){ 
        throw new customError.BadRequest('Please provide all values')
    }

    const departureDate = new Date(departureTime);
    const arrivalDate = new Date(arrivalTime);


    if(departureDate >= arrivalDate){ 
        throw new customError.BadRequest('Arrival time must be after departure time')
    }

    const flight = await Flight.create({ flight_number, aircraftId, departure, arrival, departureTime, arrivalTime });

    res.status(StatusCodes.CREATED).json({ flight, msg: 'Flight created successfully' });
}

exports.getFlights = async(req, res) => { 
    const flights = await Flight.find({});
    res.status(StatusCodes.OK).json({ count: flights.length, flights });
}

exports.getFlight = async(req, res) => { 
    const { id: flightId } = req.params;

    const flight = await Flight.findOne({ flight_number: flightId });
    if(!flight){ 
        throw new customError.NotFound(`No flight with id : ${flightId}`);
    }

    res.status(StatusCodes.OK).json({ flight });
}

exports.updateFlight = async(req, res) => { 
    const { id: flightId } = req.params;
    const { aircraftId, departure, arrival, departureTime, arrivalTime } = req.body || ''

    const updateFlight = await Flight.findOneAndUpdate({ flight_number: flightId }, req.body, 
    { new: true, runValidators: true });
    if(!updateFlight){ 
        throw new customError.NotFound(`No flight with id : ${flightId}`);
    }

    res.status(StatusCodes.OK).json({ updateFlight, msg: 'Flight updated successfully' });
}