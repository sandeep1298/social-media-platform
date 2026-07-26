const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  username: Joi.string().trim().alphanum().min(3).max(30),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const signinSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required()
});

module.exports = { signinSchema, signupSchema };
