const mongoose = require("mongoose");
const Joi = require("joi");

const User = mongoose.model("User", new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 255
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024
  }
}));

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(255).email(),
    password: Joi.string().required().min(8).max(255)
  }

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
