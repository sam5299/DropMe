const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");

//definfing user schema
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, unique: true, required: true },
  alternativeNumber: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  profile: { type: String, required: true },
  password: { type: String, minlength: 6, maxlength: 1024, require: true },
});

//object of userSchema export it letter
const User = mongoose.model("User", userSchema);

//Joi validation logic
async function isUserDataValidate(userData) {
  let joiSchema = Joi.object({
    userId: Joi.number().required(),
    name: Joi.string().max(20).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "io"] } })
      .required(),
    mobileNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    alternativeNumber: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    gender: Joi.string().required(),
    dob: Joi.string().required(),
    password: new PasswordComplexity({
      min: 8,
      max: 255,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4,
    }),
    profile: Joi.string(),
  });
  return joiSchema.validate(userData);
}

module.exports = { User, isUserDataValidate };
