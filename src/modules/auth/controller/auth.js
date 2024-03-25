import userModel from "../../../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt, { decode } from "jsonwebtoken";
import sendEmail from "../../../utils/email.js";
// 1-signUp
export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, age, gender, phone, cPassword } = req.body;
  const checkUser = await userModel.findOne({ email });
  if (checkUser) {
    return next(new Error("email is exist ", { cause: 409 }));
  }
  // if (password !== cPassword) {
  //   return next(new Error("Password mis match cPassword ", { cause: 409 }));
  // }
  const hashPassword = bcrypt.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );
  const user = await userModel.create({
    userName,
    email,
    password: hashPassword,
    age,
    gender,
    phone,
  });
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 60 }
  );
  const newToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 60 * 24 }
  );
  const html = `<p>Welcome to My App! Now your test emails will be safe. We just need to make sure your account is real.
Please, click the button below and start using your account.</p>
<a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">confirm Email</a>
<br>
<p>click the button below if you need Remove account finally</p>
<a href="${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newToken}">request new confirm email</a>
  `;
  await sendEmail({
    to: email,
    subject: "confirmEmail",
    html: html,
  });
  return res.json({ message: "check your inbox now", user });
});
//confirmEmail
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  // console.log(token);
  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);
  // console.log(decoded);
  const user = await userModel.findByIdAndUpdate(decoded.id, {
    confirmEmail: true,
  });
  return user
    ? res.json({ message: "your account is confirm  now can you log in " }) ////////////////////////////////////////////////////////
    : next(new Error("not register account ", { cause: 404 }));
});
//newConfirmEmail
export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);
  const user = await userModel.findById(decoded.id);
  if (!user) {
    return res.json({ message: "Pleas SignUp First" });
  }
  if (user.confirmEmail) {
    return res.json({ message: "your email is already confirm" });
  }
  const newToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.EMAIL_SIGNATURE,
    { expiresIn: 60 * 20 }
  );
  const html = `
<a href="${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newToken}">request new confirm email</a>
  `;
  await sendEmail({
    to: user.email,
    subject: "confirmEmail",
    html: html,
  });
  return res.json({ message: "done check your inbox now" });
});
// 2-login-->with create token
export const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("email is not exist "));
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new Error("in_valid login data "));
  }
  const updated = await userModel.updateOne(
    { _id: user.id },
    { isOnline: true, isDelete: false }
  );
  if (!updated) {
    return next(new Error("please sign in first "));
  }
  const token = jwt.sign(
    {
      userName: user.userName,
      id: user._id,
      isOnline: false,
    },
    process.env.TOKEN_SIGNATURE
    // { expiresIn: "1m" }
  );
  return res.json({ message: "Done", token });
});
