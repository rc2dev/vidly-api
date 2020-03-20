require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();

winston.exceptions.handle(
  new winston.transports.File({ filename: 'exceptions.log' })
);

process.on('unhandledRejection', ex => {
  throw ex;
});

winston.add(
  new winston.transports.File({
    filename: 'logfile.log',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss A ZZ'
      }),
      winston.format.json()
    )
  })
);

winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    metaKey: 'meta'
  })
);

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => `Listening on port ${port}`);
