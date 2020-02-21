const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Import Routes
const payment = require('./routes/payment');

//Middleware
app.use(bodyParser.json());
app.use('/payment', payment);

// Server will run on this port
app.listen(3333);
