import { exec } from 'child_process';
import * as path from 'path';

export class SofficeUtils {
    async convertToHtml(filePath: string): Promise<string> {
        const outputDir = path.dirname(filePath);

        return new Promise((resolve, reject) => {
            exec(
                `soffice --headless --convert-to html --outdir "${outputDir}" "${filePath}"`,
                (error, stdout, stderr) => {
                    if (error) {
                        reject(stderr || error.message);
                    } else {
                        const htmlFile = filePath.replace(/\.(xlsx|xls)$/i, '.html');
                        resolve(htmlFile);
                    }
                },
            );
        });
    }
}
