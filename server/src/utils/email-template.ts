import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { minify } from 'html-minifier-terser';

const templatesCache: Record<string, handlebars.TemplateDelegate> = {};

export async function renderTemplate<T extends object>(
    lang: 'en' | 'fr',
    name: string,
    context: T,
): Promise<string> {
    const cacheKey = `${lang}:${name}`;
    if (!templatesCache[cacheKey]) {
        const filePath = path.join(__dirname, '..', 'templates', lang, `${name}.html`);
        const source = fs.readFileSync(filePath, 'utf8');

        const minified = await minify(source, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
        });

        templatesCache[cacheKey] = handlebars.compile(minified);
    }

    return templatesCache[cacheKey](context);
}
