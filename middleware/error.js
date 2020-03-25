const winston = require('winston');

module.exports = function(err, req, res, next) {
  winston.error('Error', err);
  res.status(500).send('Something failed.');
};
