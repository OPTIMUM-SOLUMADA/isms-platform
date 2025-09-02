import { Request, Response } from "express";
import { LibreOfficeUtils } from "@/utils/libreoffice";
import { DOCUMENT_UPLOAD_PATH, UPLOAD_PATH } from "@/configs/upload";
import { minifyHtml } from "@/utils/html";
import { FileService } from "@/services/file.service";

export class ExcelController {

    uploadAndConvert = async (req: Request, res: Response): Promise<void> => {
        try {
            const { filename } = req.query;

            if (!filename) {
                res.status(400).json({ error: "No file name provided" });
                return;
            }

            const savedPath = await LibreOfficeUtils.convertToImage(
                `${DOCUMENT_UPLOAD_PATH}/${filename}`,
                UPLOAD_PATH
            );

            const minifiedHTML = await minifyHtml(savedPath);


            await FileService.deleteFile(savedPath);

            res.json({ html: minifiedHTML });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Excel conversion failed" });
        }
    };
}
