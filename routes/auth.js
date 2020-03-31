const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const validate = require('../middleware/validate');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', validate(validateReq), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid e-mail or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send('Invalid e-mail or password.');

  const token = user.generateAuthToken();
  res.send(token);
});

function validateReq(req) {
  const schema = {
    email: Joi.string()
      .required()
      .min(3)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(8)
      .max(255)
  };

  return Joi.validate(req, schema);
}

module.exports = router;
