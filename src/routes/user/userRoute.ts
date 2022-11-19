import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../../controller/Authentication/auth";

import * as userController from "../../controller/Users/userController";

const router = Router();

router.use(protect);
router.get("/", userController.getUsers);
router.route("/:id").get(userController.getUserById).patch(userController.updateUser).delete(userController.deleteUser);

// Update A User

export default router;
