const validate = (schema, source = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(422).json({
      success: false,
      error: error.details.map((detail) => detail.message).join(", ")
    });
  }

  req[source] = value;
  return next();
};

module.exports = validate;
