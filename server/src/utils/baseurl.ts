import { CLIENT_URL } from '@/configs/url';

export function toHashRouterUrl(path: string, params: any = {}) {
    const url = new URL(CLIENT_URL);

    // Normalize path
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Build query string
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();

    // Construct hash route *with params inside the hash*
    url.hash = queryString
        ? `${cleanPath}?${queryString}`
        : cleanPath;

    // Clear search params so nothing appears before #
    url.search = "";

    return url.toString();
}
