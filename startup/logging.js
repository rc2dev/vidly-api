// In this module, we place everything related to handling and logging errors.

const winston = require('winston');
//require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'exceptions.log' })
  );

  process.on('unhandledRejection', ex => {
    throw ex;
  });

  winston.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
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
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: 'mongodb://localhost/vidly',
  //     metaKey: 'meta'
  //   })
  // );
};
