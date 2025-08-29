import { execSync } from "child_process";

export class LibreOfficeUtils {
    static convertToPDF(inputPath: string, outputDir: string): string {
        execSync(`soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`);
        return inputPath.replace(/\.(xlsx|xls)$/i, ".pdf").replace("uploads", outputDir);
    }
}
