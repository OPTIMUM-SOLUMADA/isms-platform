import { execSync } from "child_process";

export class LibreOfficeUtils {
    static convertToPDF(inputPath: string, outputDir: string): string {
        execSync(`soffice --headless --convert-to jpg "${inputPath}" --outdir "${outputDir}"`);
        console.log("yes");
        return inputPath.replace(/\.(xlsx|xls)$/i, ".jpg").replace("documents", "");
    }
}
