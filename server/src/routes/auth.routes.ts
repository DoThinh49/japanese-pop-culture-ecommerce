import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/auth.validation.js";

const router = Router();

// Public routes
router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/google", authController.googleLogin);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

// Protected routes (require login)
router.get("/me", authenticate, authController.getMe);
router.put(
  "/profile",
  authenticate,
  validateBody(updateProfileSchema),
  authController.updateProfile
);
router.put(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

// Address management
router.post("/addresses", authenticate, authController.addAddress);
router.put("/addresses/:id", authenticate, authController.updateAddress);
router.delete("/addresses/:id", authenticate, authController.deleteAddress);
router.patch("/addresses/:id/default", authenticate, authController.setDefaultAddress);

export default router;

