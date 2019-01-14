const express = require('express');
const app = express();
const router = express.Router();
//Rotas
const index = require('./routers/index');
const personRoute = require('./routers/PersonRoute');
app.use('/', index);
app.use('/persons', personRoute);
module.exports = app;