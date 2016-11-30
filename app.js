const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const moment = require('moment');
const routes = require('./lib/routes');

const apiVersion = 'v1';
const app = express();

// Sessions are required
app.use(cookieParser());

// Parse request body types
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Compress all responses by default
app.use(compression());

// Routing
app.use(`/api/${apiVersion}`, routes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: 1,
    timestamp: moment().valueOf()
  });
});

module.exports = app;
