import { Request, Response } from "express";
import paymentService from "../services/payment.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class PaymentController {
  async handleVNPayReturn(req: Request, res: Response) {
    try {
      const result = await paymentService.handleVNPayReturn(req.query);
      return sendSuccess(res, result, result.message);
    } catch (error: any) {
      return sendError(res, error.message || "Xử lý thanh toán thất bại", 400);
    }
  }
}

export const paymentController = new PaymentController();
export default paymentController;

