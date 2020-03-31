const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validateGenre } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

router.post('/', [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name
  });
  await genre.save();

  res.send(genre);
});

// The instructor used "update first" here, but pointed
// that it could be any of the two methods.
router.put('/:id', [auth, validate(validateGenre)], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  genre.name = req.body.name;
  const result = await genre.save();
  res.send(result);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

module.exports = router;
