const { StatusCodes } = require('http-status-codes')
const customError = require('../error/')
const Aircraft = require('../model/aircraft')

exports.create_aircraft = async(req, res) => { 
    const { model, registration, seatingCapacity } = req.body || ''
    if(!model || !registration || !seatingCapacity) { 
        throw new customError.BadRequest('Please provide all values')
    }

    const valAirCraft = await Aircraft.findOne({ registration })
    if(valAirCraft) { 
        throw new customError.BadRequest('Aircraft with this registration already exists')
    }

    const aircraft = await Aircraft.create(req.body)
    res.status(StatusCodes.OK).json({ aircraft })
}

exports.get_all_aircraft = async(req, res) => { 
    const aircraft = await Aircraft.find({})
    res.status(StatusCodes.OK).json({ aircraft, count: aircraft.length })
}

exports.get_single_aircraft = async(req, res) => { 
    const { id: aircraftId } = req.params || ''
    const aircraft = await Aircraft.findOne({ registration: aircraftId })
    if(!aircraft) { 
        throw new customError.NotFound(`No aircraft with id : ${aircraftId}`)
    }
    res.status(StatusCodes.OK).json({ aircraft: aircraft })
}
