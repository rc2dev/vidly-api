const { Genre, validate } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // O prof usou let aqui e depois salvou em genre em vez de result.
  const genre = new Genre({
    name: req.body.name
  });
  const result = await genre.save();

  res.send(result);
});

// O prof usou "update first" aqui. Disse que podia qualquer um dos dois métodos.
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');

  genre.name = req.body.name;
  const result = await genre.save();
  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found');
  res.send(genre);
});

module.exports = router;
