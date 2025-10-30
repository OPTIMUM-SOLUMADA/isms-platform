import { Browser, Page, launch } from 'puppeteer';

// Internal browser instance (singleton)
let browser: Browser | null = null;

/**
 * Launch the browser if not already launched
 */
async function launchBrowser() {
    if (!browser) {
        browser = await launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }
}

/**
 * Open a URL in a new page
 */
export async function openURL(url: string): Promise<Page> {
    await launchBrowser();

    const page = await browser!.newPage();
    page.setDefaultNavigationTimeout(6000);

    await page.goto(url, { waitUntil: 'networkidle2' });
    return page;
}

/**
 * Close the browser
 */
export async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

export async function openDocumentInBrowser(fileUrl: string) {
    try {
        await openURL(fileUrl);
    } catch (err) {
        console.error('Failed to open URL:', err);
    } finally {
        await closeBrowser();
    }
}
