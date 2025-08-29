import { Router } from "express";
import { ExcelController } from "@/controllers/excel.controller";

const router = Router();
const excelController = new ExcelController();

router.get("/image", excelController.uploadAndConvert);

export default router;
