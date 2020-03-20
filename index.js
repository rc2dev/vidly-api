require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const error = require('./middleware/error');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

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

const p = Promise.reject('Something failed miserably');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to DB.'))
  .catch(() => console.error('Failed to connect to DB.'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => `Listening on port ${port}`);
