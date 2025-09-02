export function getFileType(filename: string): "pdf" | "image" | "excel" | "unknown" {
    const ext = filename.split(".").pop()?.toLowerCase();

    if (!ext) return "unknown";

    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const excelExts = ["xls", "xlsx", "xlsm", "xlsb"];
    const pdfExts = ["pdf"];

    if (pdfExts.includes(ext)) return "pdf";
    if (imageExts.includes(ext)) return "image";
    if (excelExts.includes(ext)) return "excel";

    return "unknown";
}
