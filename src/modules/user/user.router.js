import { Router } from "express";
import * as userController from "./controller/user.js";
import { auth } from "../../middleware/authuntication.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router();

router.get("/", auth, userController.getUser);
router.patch(
  "/changeP",
  validation(validators.changePassword),
  auth,
  userController.changePass
);
router.put(
  "/update",
  validation(validators.upUser),
  auth,
  userController.updateUser
);
router.delete("/delete", auth, userController.deleteUser);
router.delete("/softDel", auth, userController.softDelete);
router.patch("/logoutUser", auth, userController.logOut);
router.delete("/delByEmail", auth, userController.delByEmail);
router.get("/unsubscribe/:id", userController.unsubscribe);

//
router.patch(
  "/profile/image",
  auth,
  fileUpload("user/profile", fileValidation.Image).single("image"),
  userController.profileImage
);
export default router;
