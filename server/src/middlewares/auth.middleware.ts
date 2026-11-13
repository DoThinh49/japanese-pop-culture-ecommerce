import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";
import { Role } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, "Vui lòng đăng nhập để tiếp tục", 401);
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại", 401);
    }
    return sendError(res, "Token xác thực không hợp lệ", 401);
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Chưa xác thực người dùng", 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        "Bạn không có quyền truy cập chức năng này",
        403
      );
    }

    next();
  };
};

