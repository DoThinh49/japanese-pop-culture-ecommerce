import { Router } from "express";
import wishlistController from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", wishlistController.getMyWishlist);
router.get("/ids", wishlistController.getMyWishlistIds);
router.post("/:productId", wishlistController.toggleWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

export default router;

