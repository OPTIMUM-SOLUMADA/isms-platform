import fs from 'fs';
import { minify } from 'html-minifier-terser';

export async function minifyHtml(filePath: string) {
    const rawHtml = fs.readFileSync(filePath, 'utf-8');

    const result = await minify(rawHtml, {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        minifyCSS: true,
        minifyJS: true,
    });

    return result;
}
