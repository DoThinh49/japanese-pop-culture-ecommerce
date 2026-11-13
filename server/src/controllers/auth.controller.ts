import { Request, Response } from "express";
import authService from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { env } from "../config/env.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      return sendSuccess(
        res,
        { user: result.user, accessToken: result.accessToken },
        "Đăng ký tài khoản thành công",
        201
      );
    } catch (error: any) {
      return sendError(res, error.message || "Đăng ký thất bại", 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      return sendSuccess(
        res,
        { user: result.user, accessToken: result.accessToken },
        "Đăng nhập thành công"
      );
    } catch (error: any) {
      return sendError(res, error.message || "Đăng nhập thất bại", 400);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return sendSuccess(res, null, "Đăng xuất thành công");
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        return sendError(res, "Không tìm thấy refresh token", 401);
      }

      const result = await authService.refreshToken(token);
      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
      return sendSuccess(
        res,
        { accessToken: result.accessToken },
        "Cấp mới access token thành công"
      );
    } catch (error: any) {
      return sendError(res, error.message || "Refresh token thất bại", 401);
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getProfile(userId);
      return sendSuccess(res, user);
    } catch (error: any) {
      return sendError(res, error.message || "Không thể lấy thông tin người dùng", 400);
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const updatedUser = await authService.updateProfile(userId, req.body);
      return sendSuccess(res, updatedUser, "Cập nhật hồ sơ thành công");
    } catch (error: any) {
      return sendError(res, error.message || "Cập nhật thất bại", 400);
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const result = await authService.changePassword(userId, req.body);
      return sendSuccess(res, null, result.message);
    } catch (error: any) {
      return sendError(res, error.message || "Đổi mật khẩu thất bại", 400);
    }
  }
}

export const authController = new AuthController();
export default authController;

