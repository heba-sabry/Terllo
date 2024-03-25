export const validation = (joiSchema) => {
  return (req, res, next) => {
    const allDataFromAllMethods = { ...req.body, ...req.params, ...req.query };
    const validationResult = joiSchema.validate(allDataFromAllMethods, {
      abortEarly: false,
    });
    if (validationResult.error) {
      return res.json({
        message: "validation Error",
        validationErr: validationResult.error.details,
      });
    }
    return next();
  };
};
