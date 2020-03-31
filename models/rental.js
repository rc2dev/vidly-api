const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

// In customer, we may need isGold to give a discount.
// In movie, we need dailyRentalRate to calculate rentalFee.
// Including both, we don't need an additional query to calculate rentalFee.
const rentalSchema = new mongoose.Schema({
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
});

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  });
};

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

// We don't define dateOut because it must be defined on server.
// The same is true for dateReturned and rentalFee.
function validateRental(rental) {
  const schema = {
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

module.exports = { Rental, validateRental };
