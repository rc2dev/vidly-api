const winston = require('winston');

module.exports = function(err, req, res, next) {
  winston.error('Could not get the genres', { meta: err });
  res.status(500).send('Something failed.');
};
