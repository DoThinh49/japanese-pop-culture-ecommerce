import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class CatalogController {
  async getCategories(_req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
      return sendSuccess(res, categories);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh mục", 500);
    }
  }

  async getSeries(_req: Request, res: Response) {
    try {
      const series = await prisma.series.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
          characters: {
            include: { character: true },
          },
          _count: {
            select: { products: true },
          },
        },
      });
      return sendSuccess(res, series);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách series", 500);
    }
  }

  async getManufacturers(_req: Request, res: Response) {
    try {
      const manufacturers = await prisma.manufacturer.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
      return sendSuccess(res, manufacturers);
    } catch (error: any) {
      return sendError(res, error.message || "Lỗi tải danh sách hãng sản xuất", 500);
    }
  }
}

export const catalogController = new CatalogController();
export default catalogController;

