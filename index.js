const mongoose = require('mongoose');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to DB.'))
  .catch(() => console.error('Failed to connect to DB.'));

app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => `Listening on port ${port}`);
