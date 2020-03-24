const Joi = require('joi');
const mongoose = require('mongoose');

// Em customer, podemos precisar de isGold para dar um deconto.
// Em movie, precisaremos de dailyRentalRate para calcular a rental fee.
// Incluindo ambos, não precisamos de uma additional query para calcular a rental fee.
const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
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
      }),
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 255
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255
        }
      }),
      required: true
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 0
    }
  })
);

// We don't define dateOut because it must be defined on server.
// The same is true for dateReturned and rentalFee.
function validateRental(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
