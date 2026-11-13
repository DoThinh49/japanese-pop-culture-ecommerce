import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { sendError } from "../utils/response.js";

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0]?.message || "Dữ liệu không hợp lệ";
        return sendError(res, firstError, 422);
      }
      return sendError(res, "Lỗi kiểm tra dữ liệu", 400);
    }
  };
};

