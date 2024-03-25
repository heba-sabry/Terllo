import joi from "joi";
import { Types } from "mongoose";
export const addTask = joi
  .object({
    title: joi.string().min(3).max(20).required(),
    description: joi.string().min(3).max(30).required(),
    assignTo: joi
      .custom((value, helpers) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        }
        return helpers.message("in-valid from validation");
      })
      .required(),
    status: joi.string(),
    deadline: joi.date().required(),
  })
  .required();
export const updateTask = joi
  .object({
    title: joi.string().min(3).max(20),
    description: joi.string().min(3).max(30),
    assignTo: joi.custom((value, helpers) => {
      if (Types.ObjectId.isValid(value)) {
        return true;
      }
      return helpers.message("in-valid from validation");
    }),
    status: joi.string(),
    deadline: joi.date(),
    _id: joi
      .custom((value, helpers) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        }
        return helpers.message("in-valid from validation");
      })
      .required(),
  })
  .required();
