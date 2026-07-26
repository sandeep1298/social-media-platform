const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  body: Joi.string().trim().min(2).max(2000).required(),
  photo: Joi.string().trim().uri().required()
});

const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  body: Joi.string().trim().min(2).max(2000),
  photo: Joi.string().trim().uri()
}).min(1);

const commentSchema = Joi.object({
  postId: Joi.string().hex().length(24).required(),
  text: Joi.string().trim().min(1).max(500).required()
});

const postActionSchema = Joi.object({
  postId: Joi.string().hex().length(24).required()
});

module.exports = {
  commentSchema,
  postActionSchema,
  postSchema,
  updatePostSchema
};
