import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

export const DOCUMENT_UPLOAD_PATH = path.join(process.cwd(), "uploads", "documents");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create folder if it doesn't exist
        if (!fs.existsSync(DOCUMENT_UPLOAD_PATH)) {
            fs.mkdirSync(DOCUMENT_UPLOAD_PATH, { recursive: true });
        }

        cb(null, DOCUMENT_UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const [name] = file.originalname.split(".");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${name}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = [
        "application/pdf",

        // Word
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.oasis.opendocument.text", // .odt

        // Excel
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF or DOC allowed"));
    }
};

export const uploadDocument = multer({
    storage,
    fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 },
});
