import { useEffect } from "react";

const BASE_TITLE = document.title;

export function usePageTitle(pageTitle?: string) {
    useEffect(() => {
        if (pageTitle) {
            document.title = `${pageTitle} | ${BASE_TITLE}`;
        } else {
            document.title = BASE_TITLE;
        }
    }, [pageTitle]);
}
