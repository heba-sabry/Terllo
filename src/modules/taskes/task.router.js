import { Router } from "express";
import * as taskController from "./controller/task.js";
import { auth } from "../../middleware/authuntication.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./validation.js";
const router = Router();

router.get("/", auth, taskController.getTask);
router.get("/allCreated", auth, taskController.allTaskC);
router.get("/allAssignToMe", auth, taskController.allTasksMe);
router.get("/allAssignToAny/:assignTo", auth, taskController.allTasksToAny);
router.get("/allLateToMe", auth, taskController.allLateT);
router.post(
  "/add",
  validation(validators.addTask),
  auth,
  taskController.addTask
);
router.patch(
  "/update/:_id",
  validation(validators.updateTask),
  auth,
  taskController.updateTask
);
router.delete("/deleteTask/:_id", auth, taskController.deleteTask);
export default router;
