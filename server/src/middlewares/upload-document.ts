import { uploadDocument } from "@/configs/multer";

export const uploadSingleDocument = uploadDocument.single("document");
export const uploadMultipleDocuments = uploadDocument.array("documents", 5);
