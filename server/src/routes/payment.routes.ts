import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";

const router = Router();

router.get("/vnpay/return", paymentController.handleVNPayReturn);

export default router;

