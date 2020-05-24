const Joi = require("@hapi/joi");

class Validations {
  validateRequest = (req, res, next) => {
    const rules = Joi.object({
      name: Joi.string(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      subscription: Joi.string(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      return res.status(422).json({ message: "Missing required field" });
    }
    next();
  };
  validateSignIn = (req, res, next) => {
    const rules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      return res.status(422).json({ message: "Missing required field" });
    }
    next();
  };
}
module.exports = new Validations();
