import taskModel from "../../../../DB/model/Task.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt from "jsonwebtoken";

// 1-add task with status (toDo)(user must be logged in)
export const addTask = asyncHandler(async (req, res, next) => {
  const { title, description, assignTo, status, deadline } = req.body;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("user is not valid", { cause: 404 }));
  }
  const checkAssignTo = await userModel.findById({ _id: assignTo });
  if (!checkAssignTo) {
    return next(
      new Error("this user you want to assign this task not exist ):", {
        cause: 404,
      })
    );
  }
  if (user.isDelete === true) {
    return next(
      new Error("you can not access to add any task", { cause: 404 })
    );
  }
  let myDate = new Date();
  let myDeadline = new Date(deadline);
  if (myDate > myDeadline) {
    return next(new Error("Enter valid Date", { cause: 404 }));
  }
  const task = await taskModel.create({
    title,
    description,
    assignTo,
    status,
    deadline,
    userId: req.user.id,
  });
  return res.json({ message: "Done", task });
});
// 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)
export const updateTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, deadline } = req.body;
  const { _id } = req.params;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("user is not valid", { cause: 404 }));
  }
  if (user.isDelete === true) {
    return next(
      new Error("you can not access to update any task", { cause: 404 })
    );
  }
  const createT = await taskModel.findOne({ userId: user._id });
  if (!createT) {
    return next(
      new Error("you are not allowed update this task ", { cause: 404 })
    );
  }
  let myDate = new Date();
  let myDeadline = new Date(deadline);
  if (myDate > myDeadline) {
    return next(new Error("Enter valid Date", { cause: 404 }));
  }
  const task = await taskModel.findByIdAndUpdate(
    { _id },
    {
      title,
      description,
      status,
      deadline,
    },
    { new: true }
  );
  if (!task) {
    return next(new Error("this task is not valid", { cause: 404 }));
  }
  return res.json({ message: "Done", task });
});
// 3-delete task(user must be logged in) (creator only can delete task)
export const deleteTask = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("user is not valid", { cause: 404 }));
  }
  if (user.isDelete === true) {
    return next(
      new Error("you can not access to delete any task", { cause: 404 })
    );
  }
  const createT = await taskModel.findOne({ userId: user._id });
  if (!createT) {
    return next(
      new Error("you are not allowed delete this task ", { cause: 404 })
    );
  }
  const task = await taskModel.findByIdAndDelete({ _id }, { new: true });
  if (!task) {
    return next(new Error("this task is not valid", { cause: 404 }));
  }
  return res.json({ message: "Done", task });
});
// 4-get all tasks with user data
export const getTask = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("user is not valid", { cause: 404 }));
  }
  if (user.isDelete === true) {
    return next(
      new Error("you can not access to get any task", { cause: 404 })
    );
  }
  const tasks = await taskModel
    .find()
    .populate([{ path: "assignTo" }, { path: "userId" }]);
  return res.json({ message: "Done", tasks });
});
//5- get all tasks assign to me
export const allTasksMe = asyncHandler(async (req, res, next) => {
  const tasks = await taskModel.find({ assignTo: req.user._id }).populate([
    { path: "assignTo", select: "userName email" },
    { path: "userId", select: "userName email" },
  ]);
  return res.json({ message: "Done", tasks });
});
//6-get all late
export const allLateT = asyncHandler(async (req, res, next) => {
  var myDate = new Date();
  const tasks = await taskModel
    .find({ assignTo: req.user._id, deadline: { $lt: myDate } })
    .populate([
      { path: "assignTo", select: "userName email" },
      { path: "userId", select: "userName email" },
    ]);
  return res.json({ message: "Done", tasks });
});
//7- get all tasks assign to any
export const allTasksToAny = asyncHandler(async (req, res, next) => {
  const { assignTo } = req.params;
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("user is not valid", { cause: 404 }));
  }
  const tasks = await taskModel.find({ assignTo }).populate([
    { path: "assignTo", select: "userName email" },
    { path: "userId", select: "userName email" },
  ]);
  return res.json({ message: "Done", tasks });
});
// 8- get all created tasks
export const allTaskC = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("user is not valid", { cause: 404 }));
  }
  const tasks = await taskModel.find().populate([
    { path: "assignTo", select: "userName email" },
    { path: "userId", select: "userName email" },
  ]);
  return res.json({ message: "Done", tasks });
});
