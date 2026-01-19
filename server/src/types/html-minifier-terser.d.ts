declare module 'html-minifier-terser' {
  interface MinifyOptions {
    collapseWhitespace?: boolean;
    removeComments?: boolean;
    minifyCSS?: boolean | object;
    minifyJS?: boolean | object;
    [key: string]: any;
  }

  export function minify(
    input: string,
    options?: MinifyOptions
  ): string;

  export default { minify };
}
