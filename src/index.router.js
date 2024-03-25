import connectionDB from "../DB/connection.js";
import userRouter from "./modules/user/user.router.js";
import taskRouter from "./modules/taskes/task.router.js";
import authRouter from "./modules/auth/auth.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
const bootstrap = (app, express) => {
  app.use(express.json());
  connectionDB();
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/task", taskRouter);
  app.use("*", (req, res, next) => {
    return res.json("in_valid Routing");
  });
  app.use(globalErrorHandling);
};
export default bootstrap;
