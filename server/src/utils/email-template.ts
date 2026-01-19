import fs from 'fs';
import path from 'path';
import Handlebars, { TemplateDelegate } from 'handlebars';
import juice from 'juice';
import { minify } from 'html-minifier-terser';
import { TEMPLATE_DIR_PATH } from '@/configs/path';

const templatesCache: Record<string, TemplateDelegate> = {};
const partialsRegistered = { en: false, fr: false };

async function registerPartials(lang: 'en' | 'fr') {
  if (partialsRegistered[lang]) return;

  const partialsDir = path.join(TEMPLATE_DIR_PATH, 'partials');
  const files = fs.readdirSync(partialsDir);

  for (const file of files) {
    const name = path.basename(file, '.html');
    const source = fs.readFileSync(path.join(partialsDir, file), 'utf8');
    Handlebars.registerPartial(name, source);
  }

  partialsRegistered[lang] = true;
}

export async function renderTemplate<T extends object>(
  lang: 'en' | 'fr',
  templateName: string,
  context: T,
): Promise<string> {
  await registerPartials(lang);

  const bodyKey = `${lang}:body:${templateName}`;
  if (!templatesCache[bodyKey]) {
    const bodyPath = path.join(TEMPLATE_DIR_PATH, lang, `${templateName}.html`);
    const bodySource = fs.readFileSync(bodyPath, 'utf8');
    templatesCache[bodyKey] = Handlebars.compile(bodySource);
  }
  const bodyHtml = templatesCache[bodyKey](context);

  const layoutKey = `${lang}:layout`;
  if (!templatesCache[layoutKey]) {
    const layoutPath = path.join(TEMPLATE_DIR_PATH, lang, 'layout.html');
    const layoutSource = fs.readFileSync(layoutPath, 'utf8');
    templatesCache[layoutKey] = Handlebars.compile(layoutSource);
  }

  const fullHtml = templatesCache[layoutKey]({
    ...context,
    body: bodyHtml,
    lang,
  });

  const inlined = juice(fullHtml);

  return await minify(inlined, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });
}
