import { Router } from "express";
import catalogController from "../controllers/catalog.controller.js";

const router = Router();

router.get("/categories", catalogController.getCategories);
router.get("/series", catalogController.getSeries);
router.get("/manufacturers", catalogController.getManufacturers);

export default router;
