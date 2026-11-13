import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { Role } from "@prisma/client";

const router = Router();

// All routes require authentication and ADMIN or STAFF role
router.use(authenticate, authorize(Role.ADMIN, Role.STAFF));

// Statistics
router.get("/stats", adminController.getStats);

// Order management
router.get("/orders", adminController.getOrders);
router.patch("/orders/:id/status", adminController.updateOrderStatus);

// Product management
router.get("/products", adminController.getProducts);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

// Voucher management
router.get("/vouchers", adminController.getVouchers);
router.post("/vouchers", adminController.createVoucher);
router.patch("/vouchers/:id/toggle", adminController.toggleVoucher);

// User management
router.get("/users", adminController.getUsers);

export default router;

