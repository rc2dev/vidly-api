const mongoose = require('mongoose');
const Joi = require('joi');

// No need to define rentalScheme separetely,
// since this is the only place we use it.
const Customer = mongoose.model(
  'Customer',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    }
  })
);

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

module.exports = { Customer, validateCustomer };
