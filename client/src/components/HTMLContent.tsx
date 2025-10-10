import { FC } from "react";
import DOMPurify from "dompurify";
import clsx from "clsx";

interface HtmlContentProps {
    html: string;
    className?: string;
}

const HtmlContent: FC<HtmlContentProps> = ({ html, className }) => {
    // Sanitize HTML to prevent XSS
    const sanitized = DOMPurify.sanitize(html);

    // If no visible text, show fallback
    const isEmpty = !sanitized.replace(/<[^>]*>/g, "").trim();

    if (isEmpty) {
        return (
            <p className="text-gray-400 italic text-sm">No content available</p>
        );
    }

    return (
        <div
            className={clsx(
                "prose prose-sm max-w-none text-gray-800 dark:text-gray-200",
                "prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:underline",
                "prose-img:rounded-lg prose-img:shadow-sm cursor-auto",
                className
            )}
            dangerouslySetInnerHTML={{ __html: sanitized }}
        />
    );
};

export default HtmlContent;
