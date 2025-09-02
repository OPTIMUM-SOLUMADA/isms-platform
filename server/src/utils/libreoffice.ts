import { execSync } from "child_process";
import path from "path";
import fs from "fs";

export class LibreOfficeUtils {
    static convertToPDF(inputPath: string, outputDir: string): string {
        execSync(`soffice --headless --convert-to jpg "${inputPath}" --outdir "${outputDir}"`);
        console.log("yes");
        return inputPath.replace(/\.(xlsx|xls)$/i, ".jpg").replace("documents", "");
    }

    /**
  * Convert an Excel file (XLSX/XLS) into an image of the first sheet.
  * Uses LibreOffice + ImageMagick.
  *
  * @param inputPath Path to the input Excel file
  * @param outputDir Directory for generated image
  * @param resolution DPI for the image (default: 200)
  * @returns Absolute path to generated image
  */
    static convertToImage(inputPath: string, outputDir: string): string {
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }

        fs.mkdirSync(outputDir, { recursive: true });

        const basename = path.basename(inputPath, path.extname(inputPath));
        const htmlPath = path.join(outputDir, `${basename}.html`);

        execSync(
            `soffice --headless --convert-to html --outdir "${outputDir}" "${inputPath}"`,
            { stdio: "inherit" }
        );

        return htmlPath;
    }
}
