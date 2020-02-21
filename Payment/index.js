const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const app = express();

//Import Routes
const payment = require('./routes/payment');

//Middleware
app.use(bodyParser.json());
app.use('/payment', payment);

module.exports.handler = serverless(app);
