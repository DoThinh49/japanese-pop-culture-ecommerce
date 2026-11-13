import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import wishlistService from "../services/wishlist.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class WishlistController {
  async getMyWishlist(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const wishlist = await wishlistService.getUserWishlist(userId);
      return sendSuccess(res, wishlist);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách yêu thích", 400);
    }
  }

  async getMyWishlistIds(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const ids = await wishlistService.getUserWishlistProductIds(userId);
      return sendSuccess(res, ids);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách yêu thích", 400);
    }
  }

  async toggleWishlist(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const productId = Number(req.params.productId);
      const result = await wishlistService.toggleWishlist(userId, productId);
      return sendSuccess(res, result, result.message);
    } catch (error: any) {
      return sendError(res, error.message || "Thao tác thất bại", 400);
    }
  }

  async removeFromWishlist(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const productId = Number(req.params.productId);
      const result = await wishlistService.removeFromWishlist(userId, productId);
      return sendSuccess(res, result, result.message);
    } catch (error: any) {
      return sendError(res, error.message || "Thao tác thất bại", 400);
    }
  }
}

export const wishlistController = new WishlistController();
export default wishlistController;

