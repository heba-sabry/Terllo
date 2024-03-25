import userModel from "../../../../DB/model/user.model.js";
import sendEmail from "../../../utils/email.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import bcrypt from "bcrypt";

export const getUser = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  return res.json({ message: "Done", users });
});

// 3-change password (user must be logged in)
export const changePass = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, cPassword } = req.body;
  const user = await userModel.findById({ _id: req.user._id });
  if (!user) {
    return next(new Error("in_valid account", { cause: 404 }));
  }
  // if (newPassword !== cPassword) {
  //   return next(new Error("newPassword mis match cPassword ", { cause: 409 }));
  // }
  const match = bcrypt.compareSync(oldPassword, user.password);
  if (!match) {
    return next(
      new Error("old password mis match your password", { cause: 400 })
    );
  }
  const hashPassword = bcrypt.hashSync(newPassword, 6);
  const updateP = await userModel.findOneAndUpdate(
    { _id: user._id, isOnline: true, isDelete: false },
    { password: hashPassword },
    { new: true }
  );
  if (!updateP) {
    return next(new Error("please login first", { cause: 404 }));
  }
  return res.json({ message: "Done", updateP });
});
// 4-update user (age ,phone)(user must be logged in)
export const updateUser = asyncHandler(async (req, res, next) => {
  const { age, phone, userName } = req.body;
  const user = await userModel.findById(req.user.id);
  // console.log({ ...req.user });
  if (!user) {
    return next(new Error("in_valid account", { cause: 404 }));
  }
  const update = await userModel.findOneAndUpdate(
    { _id: user.id, isOnline: true, isDelete: false },
    { age, phone, userName },
    { new: true }
  );
  if (!update) {
    return next(new Error("please login first", { cause: 404 }));
  }
  return res.json({ message: "Done", update });
});
// 5-delete user(user must be logged in)
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new Error("in_valid account", { cause: 404 }));
  }
  const deleted = await userModel.findOneAndDelete(
    {
      _id: req.user.id,
      isOnline: true,
      isDelete: false,
    },
    {
      new: true,
    }
  );
  if (!deleted) {
    return next(new Error("please login first", { cause: 404 }));
  }
  return res.json({ message: "Done" });
});
// 6-soft delete(user must be logged in)
export const softDelete = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new Error("in_valid account", { cause: 404 }));
  }
  const softDelUser = await userModel.findOneAndUpdate(
    { _id: user.id, isOnline: true },
    { isDelete: true }
  );
  if (!softDelUser) {
    return next(new Error("please login first", { cause: 404 }));
  }
  return res.json({ message: "Done" });
});
// 7-logout
export const logOut = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById({ _id: req.user.id });
  if (!user) {
    return next(new Error("in_valid account", { cause: 404 }));
  }
  const logoutUser = await userModel.findOneAndUpdate(
    {
      _id: user.id,
      isOnline: true,
      isDelete: false,
    },
    { isOnline: false },
    { new: true }
  );
  if (!logoutUser) {
    return next(
      new Error("please login first or Exit on softDelete status", {
        cause: 404,
      })
    );
  }
  return res.json({ message: "Done", logoutUser });
});
//8-delete user by email
export const delByEmail = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("in_valid account", { cause: 404 }));
  }
  const html = `
<p>click the button below if you need Remove account finally</p>
<a href="http://localhost:3000/user/unsubscribe/${user._id}">delete my Email</a>
  `;
  await sendEmail({
    to: user.email,
    subject: "delete your account ",
    html: html,
  });
  return res.json({ message: "check your inbox now" });
});
export const unsubscribe = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await userModel.findByIdAndDelete(id);
  return deleted
    ? res.json({ message: "your account is deleted successfully" })
    : next(new Error("not register account ", { cause: 404 }));
});
//
export const profileImage = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { profileImage: req.file.fileDest },
    { new: true }
  );
  return res.json({ message: "done", file: req.file, user });
});
