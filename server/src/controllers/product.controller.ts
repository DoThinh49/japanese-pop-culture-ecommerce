import { Request, Response } from "express";
import productService from "../services/product.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const result = await productService.getProducts(req.query as any);
      return sendSuccess(res, result);
    } catch (error: any) {
      return sendError(res, error.message || "Không thể tải danh sách sản phẩm", 400);
    }
  }

  async getFeatured(req: Request, res: Response) {
    try {
      const products = await productService.getFeaturedProducts();
      return sendSuccess(res, products);
    } catch (error: any) {
      return sendError(res, error.message || "Không thể tải sản phẩm nổi bật", 400);
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const product = await productService.getProductBySlug(slug);
      return sendSuccess(res, product);
    } catch (error: any) {
      return sendError(res, error.message || "Không tìm thấy sản phẩm", 404);
    }
  }
}

export const productController = new ProductController();
export default productController;
