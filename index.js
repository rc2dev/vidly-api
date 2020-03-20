const winston = require('winston');
const express = require('express');
const app = express();

// Logging first, just in case we get an error when loading other modules.
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
