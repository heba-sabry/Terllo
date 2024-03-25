import { Schema, Model, model } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
    },
    cPassword: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      unique: true,
    },
    isDelete: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = model("user", userSchema);
export default userModel;
