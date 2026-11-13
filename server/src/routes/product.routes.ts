import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/featured", productController.getFeatured);
router.get("/", productController.getProducts);
router.get("/:slug", productController.getBySlug);

export default router;
