import joi from "joi";

export const changePassword = joi
  .object({
    newPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/))
      .required(),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
    oldPassword: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/))
      .required(),
  })
  .required();

export const upUser = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    age: joi.number().min(16).max(80).integer().positive(),
    phone: joi.string().max(11),
  })
  .required();
