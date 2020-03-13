const mongoose = require("mongoose");
const Joi = require("joi");

// Em customer, podemos precisar de isGold para dar um deconto.
// Em movie, precisaremos de dailyRentalRate para calcular a rental fee.
// Incluindo ambos, não precisamos de uma additional query para calcular a rental fee.
const Rental = mongoose.model("Rental", new mongoose.Schema({
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
}));

// Não definimos deteOut porque deve ser definida no servidor.
// Idem para dateReturned e rentalFee.
function validateRental(rental) {
  const schema = {
    movieId: Joi.string().required(),
    customerId: Joi.string().required(),
  }
  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
