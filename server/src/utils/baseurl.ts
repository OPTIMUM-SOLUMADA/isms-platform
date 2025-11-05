import { CLIENT_URL } from '@/configs/url';

export function toHashRouterUrl(path: string, params: any = {}) {
    const url = new URL(CLIENT_URL);

    // Build query string
    const searchParams = new URLSearchParams(params);

    // Combine base, query, and hash route
    url.search = searchParams.toString();
    const cPath = path.startsWith('/') ? path : `/${path}`;
    url.hash = path.startsWith('#') ? path : cPath;

    return url.toString();
}
