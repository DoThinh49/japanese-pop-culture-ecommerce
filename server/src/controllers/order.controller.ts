import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import orderService from "../services/order.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class OrderController {
  async createOrder(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const clientIp =
        (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

      const result = await orderService.createOrder({
        ...req.body,
        userId,
        clientIp,
      });

      return sendSuccess(res, result, "Đặt hàng thành công", 201);
    } catch (error: any) {
      return sendError(res, error.message || "Không thể tạo đơn hàng", 400);
    }
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const orders = await orderService.getMyOrders(userId);
      return sendSuccess(res, orders);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải lịch sử đơn hàng", 400);
    }
  }

  async getOrderByCode(req: AuthRequest, res: Response) {
    try {
      const { orderCode } = req.params;
      const userId = req.user?.userId;
      const userRole = req.user?.role;
      const order = await orderService.getOrderByCode(orderCode, userId, userRole);
      return sendSuccess(res, order);
    } catch (error: any) {
      return sendError(res, error.message || "Không tìm thấy đơn hàng", 404);
    }
  }
}

export const orderController = new OrderController();
export default orderController;

