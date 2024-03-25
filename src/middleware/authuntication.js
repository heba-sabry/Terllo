import userModel from "../../DB/model/user.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import jwt from "jsonwebtoken";
export const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  // console.log({ authorization });
  if (!authorization?.startsWith(process.env.TOKEN_BEARER)) {
    return next(new Error("authorization is required or in-valid BearerKey"), {
      cause: 400,
    });
  }
  const token = authorization.split(process.env.TOKEN_BEARER)[1];
  if (!token) {
    return next(new Error("token is required"), {
      cause: 401,
    });
  }
  const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);
  // console.log({ decoded });
  if (!decoded?.id) {
    return next(new Error("In-valid payload"), { cause: 400 });
  }
  const user = await userModel.findById(decoded.id);
  // console.log({ user });
  if (!user) {
    return next(new Error("not register account"), { cause: 404 });
  }
  req.user = user;
  return next();
});
