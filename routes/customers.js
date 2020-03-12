const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, minlength: 3, maxlength: 50 }
  })
);

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(400, error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  const result = await customer.save();
  res.send(result);
});

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(400, error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    },
    { new: true }
  );
  if (!customer)
    return res.send(404, "Couldn't find the customer with that ID");

  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.send(404, "Couldn't find the customer with that ID");
  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.send(404, "Couldn't find the customer with that ID");

  res.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(50),
    isGold: Joi.boolean(),
    phone: Joi.string()
      .min(3)
      .max(50)
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
