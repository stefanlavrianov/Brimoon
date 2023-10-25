import { Router } from "express";
import { methods as serviceController } from "../controllers/service.controller.js";

const router = Router();

router.post("/", serviceController.getServices);
router.get("/:id", serviceController.getService);
router.post("/addService", serviceController.addService);
router.put("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

export default router;
