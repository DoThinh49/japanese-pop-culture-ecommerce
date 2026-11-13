import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, orderController.createOrder);
router.get("/my-orders", authenticate, orderController.getMyOrders);
router.get("/:orderCode", authenticate, orderController.getOrderByCode);

export default router;

