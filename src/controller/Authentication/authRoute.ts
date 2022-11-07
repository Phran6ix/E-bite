import { Router } from "express";
import { body } from "express-validator";
import * as AuthController from "./auth";

const router = Router();
// USER SIGN UP
router.post(
  "/sign-up",
  body("firstName").isString(),
  body("lastName").isString(),
  body("email").isEmail(),
  AuthController.signUp
);

router.patch("/verifyOTP", AuthController.verifyOTP);
router.post("/login", AuthController.userLogin);
router.patch(
  "/update-password",
  AuthController.protect,
  AuthController.updatePassword
);

export default router;
