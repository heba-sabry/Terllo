import { Schema, model, Types } from "mongoose";
const taskSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      require: true,
    },
    assignTo: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["toDo", "doing", "done"],
      default: "toDo",
      required: true,
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const taskModel = model("task", taskSchema);
export default taskModel;
