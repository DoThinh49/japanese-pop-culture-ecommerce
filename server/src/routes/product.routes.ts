import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/featured", productController.getFeatured);
router.get("/", productController.getProducts);
router.get("/:slug", productController.getBySlug);
router.post("/:slug/reviews", authenticate, productController.addReview);

export default router;

