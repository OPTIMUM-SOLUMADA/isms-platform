// routes/compliance.routes.ts
import { ComplianceController } from "@/controllers/compliance.controller";
import { Router } from "express";

const router = Router();
const controller = new ComplianceController();

router.get("/", controller.listClause.bind(controller));
router.get("/:id", controller.get.bind(controller));
router.post("/clause", controller.createClauseCompliance.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
