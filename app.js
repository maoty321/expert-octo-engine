require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const notFound = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandle');

const flightRouter = require('./route/flight');
const aircraftRouter = require('./route/aircraft');
const authRouter = require('./route/auth');

//connect db
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
.then(() => { console.log(`connect to Database`)})
.catch(err => {console.log(err)});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
app.use('/flight', flightRouter);
app.use('/aircraft', aircraftRouter);
app.use('/', authRouter);

//routeMiddleware
app.use(notFound);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});