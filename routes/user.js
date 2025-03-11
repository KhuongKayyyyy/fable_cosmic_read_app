import express from "express";
import { body, validationResult } from "express-validator";
import { userController } from "../controllers/index.js";

const router = express.Router();

router.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    userController.login
  );

  router.post("/register", userController.register);
  router.get("/:id", (req, res) => {
    userController.getUserById(req, res);
});
export default router;