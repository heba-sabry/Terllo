import joi from "joi";

export const signUp = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ["com", "net", "edu"] },
      })
      .required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/))
      .required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    age: joi.number().min(16).max(80).integer().positive(),
    gender: joi.string(),
    phone: joi.string().max(11),
  })
  .required();
export const login = joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ["com", "net", "edu"] },
      })
      .required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/))
      .required(),
  })
  .required();
