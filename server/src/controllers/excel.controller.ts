import { Request, Response } from "express";
import { DOCUMENT_UPLOAD_PATH } from "@/configs/multer/document-multer";
import { LibreOfficeUtils } from "@/utils/libreoffice";

export class ExcelController {

    uploadAndConvert = async (req: Request, res: Response): Promise<void> => {
        try {
            const { filename } = req.query;

            if (!filename) {
                res.status(400).json({ error: "No file name provided" });
                return;
            }

            const imagePath = await LibreOfficeUtils.convertToPDF(
                `${DOCUMENT_UPLOAD_PATH}/${filename}`,
                "uploads"
            );

            console.log(imagePath);

            res.sendFile(imagePath);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Excel conversion failed" });
        }
    };
}
