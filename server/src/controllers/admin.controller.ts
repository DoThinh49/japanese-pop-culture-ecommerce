import { Request, Response } from "express";
import adminService from "../services/admin.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export class AdminController {
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await adminService.getStats();
      return sendSuccess(res, stats);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải thống kê", 400);
    }
  }

  async getOrders(req: Request, res: Response) {
    try {
      const result = await adminService.getOrders(req.query as any);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách đơn hàng", 400);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const { status, note } = req.body;
      const adminUserId = req.user?.userId;
      const order = await adminService.updateOrderStatus(orderId, status, note, adminUserId);
      return sendSuccess(res, order, "Cập nhật trạng thái đơn hàng thành công");
    } catch (error: any) {
      return sendError(res, error.message || "Cập nhật trạng thái thất bại", 400);
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const result = await adminService.getProducts(req.query as any);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách sản phẩm", 400);
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const product = await adminService.createProduct(req.body);
      return sendSuccess(res, product, "Thêm sản phẩm thành công", 201);
    } catch (error: any) {
      return sendError(res, error.message || "Thêm sản phẩm thất bại", 400);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await adminService.updateProduct(id, req.body);
      return sendSuccess(res, product, "Cập nhật sản phẩm thành công");
    } catch (error: any) {
      return sendError(res, error.message || "Cập nhật sản phẩm thất bại", 400);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await adminService.deleteProduct(id);
      return sendSuccess(res, null, result.message);
    } catch (error: any) {
      return sendError(res, error.message || "Xóa sản phẩm thất bại", 400);
    }
  }

  async getVouchers(_req: Request, res: Response) {
    try {
      const vouchers = await adminService.getVouchers();
      return sendSuccess(res, vouchers);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách voucher", 400);
    }
  }

  async createVoucher(req: Request, res: Response) {
    try {
      const voucher = await adminService.createVoucher(req.body);
      return sendSuccess(res, voucher, "Tạo mã khuyến mãi thành công", 201);
    } catch (error: any) {
      return sendError(res, error.message || "Tạo mã khuyến mãi thất bại", 400);
    }
  }

  async toggleVoucher(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const voucher = await adminService.toggleVoucher(id);
      return sendSuccess(res, voucher, "Cập nhật trạng thái voucher thành công");
    } catch (error: any) {
      return sendError(res, error.message || "Cập nhật thất bại", 400);
    }
  }

  async getUsers(_req: Request, res: Response) {
    try {
      const users = await adminService.getUsers();
      return sendSuccess(res, users);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách người dùng", 400);
    }
  }
}

export const adminController = new AdminController();
export default adminController;

