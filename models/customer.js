const mongoose = require('mongoose');
const Joi = require('joi');

// Não precisamos definir rentalSchema separado,
// porque aqui é o único lugar onde o usamos.
const Customer = mongoose.model('Customer', new mongoose.Schema({
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
}));

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

exports.Customer = Customer;
exports.validate = validateCustomer;
