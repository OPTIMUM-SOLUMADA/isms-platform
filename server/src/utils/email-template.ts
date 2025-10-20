import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import juice from 'juice';
import { minify } from 'html-minifier-terser';
import { TEMPLATE_DIR_PATH } from '@/configs/path';

const templatesCache: Record<string, handlebars.TemplateDelegate> = {};
const partialsRegistered = { en: false, fr: false };

async function registerPartials(lang: 'en' | 'fr') {
    if (partialsRegistered[lang]) return;

    const partialsDir = path.join(TEMPLATE_DIR_PATH, 'partials');
    const files = fs.readdirSync(partialsDir);

    for (const file of files) {
        const name = path.basename(file, '.html');
        const source = fs.readFileSync(path.join(partialsDir, file), 'utf8');
        handlebars.registerPartial(name, source);
    }

    partialsRegistered[lang] = true;
}

export async function renderTemplate<T extends object>(
    lang: 'en' | 'fr',
    templateName: string,
    context: T,
): Promise<string> {
    await registerPartials(lang);

    // Load and compile main template content (body)
    const bodyKey = `${lang}:body:${templateName}`;
    if (!templatesCache[bodyKey]) {
        const bodyPath = path.join(TEMPLATE_DIR_PATH, lang, `${templateName}.html`);
        const bodySource = fs.readFileSync(bodyPath, 'utf8');
        templatesCache[bodyKey] = handlebars.compile(bodySource);
    }
    const bodyHtml = templatesCache[bodyKey](context);

    // Load and compile layout
    const layoutKey = `${lang}:layout`;
    if (!templatesCache[layoutKey]) {
        const layoutPath = path.join(TEMPLATE_DIR_PATH, lang, 'layout.html');
        const layoutSource = fs.readFileSync(layoutPath, 'utf8');
        templatesCache[layoutKey] = handlebars.compile(layoutSource);
    }

    // Render final HTML
    const fullHtml = templatesCache[layoutKey]({
        ...context,
        body: bodyHtml,
        lang,
    });

    // Inline all styles for email clients
    const inlined = juice(fullHtml);

    // Optional: minify
    return await minify(inlined, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
    });
}
