const { StatusCodes } = require('http-status-codes');
const customError = require('../error/');
const Flight = require('../model/flight');
const Fares = require('../model/fares');

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

exports.deleteFlight = async(req, res) => { 
    const { id: flightId } = req.params;
    
    const flight = await Flight.findOneAndDelete({ flight_number: flightId });
    if(!flight){ 
        throw new customError.NotFound(`No flight with id : ${flightId}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'Flight deleted successfully' });
}

exports.createFare = async(req, res) => { 
    const { flight_number } = req.params;
    const { price, fareClass, seat_total } = req.body || ''

    if(!flight_number || !price || !fareClass || !seat_total){ 
        throw new customError.BadRequest('Please provide all values')
    }

    const checkclass = await Fares.findOne({ flight_number, class: fareClass });
    if(checkclass){ 
        throw new customError.BadRequest(`Fare for class ${fareClass} already exists for flight ${flight_number}`)
    } 

    const flight = await Fares.create({ flight_number, price, class: fareClass, seat_total, available_seat: seat_total });

    res.status(StatusCodes.CREATED).json({ flight, msg: 'Fare created successfully' });
}

exports.updateFare = async(req, res) => { 
    const { id } = req.params;
    const { price, fareClass, seat_total } = req.body || ''

    const fare = await Fares.findByIdAndUpdate(id , req.body, 
    { new: true, runValidators: true });
    if(!fare){ 
        throw new customError.NotFound(`No fare with id : ${id}`);
    }

    res.status(StatusCodes.OK).json({ fare, msg: 'Fare updated successfully' });
}

exports.deleteFare = async(req, res) => { 
    const { id } = req.params;
    
    const fare = await Fares.findByIdAndDelete(id);
    if(!fare){ 
        throw new customError.NotFound(`No fare with id : ${id}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'Fare deleted successfully' });
}


exports.getFares = async(req, res) => {
    const {id: flight_number} = req.params;
    if(!flight_number){ 
        throw new customError.BadRequest('Please provide flight number')
    }

    const fares = await Fares.find({ flight_number });
    if(!fares){ 
        throw new customError.NotFound(`No fares found for flight number : ${flight_number}`);
    }

    const flight_numbers = fares[0].flight_number

    const flight = await Flight.findOne({ flight_number: flight_numbers });
    if(!flight){ 
        throw new customError.NotFound(`No flight with flight number : ${flight_numbers}`);
    }

    res.status(StatusCodes.OK).json({ fare_count: fares.length, flight, fares: fares });
}