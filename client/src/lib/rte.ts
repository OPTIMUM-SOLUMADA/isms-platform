export function isEmptyHtml(html: string) {
    // Remove all HTML tags
    const text = html.replace(/<[^>]*>/g, "").trim();
    // Check if anything is left
    return text === "";
}