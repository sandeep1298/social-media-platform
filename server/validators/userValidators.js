const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  username: Joi.string().trim().alphanum().min(3).max(30),
  bio: Joi.string().allow("").trim().max(160),
  profilePic: Joi.string().allow("").trim().uri()
}).min(1);

module.exports = { updateProfileSchema };
