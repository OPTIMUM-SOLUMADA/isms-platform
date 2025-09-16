import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import type { Document } from "@/types";
import { FileSpreadsheet } from "lucide-react";

interface DocumentsHoverCardProps {
    documents: Document[];
    /** Maximum number of visible items before scrolling */
    maxVisible?: number;
    /** Maximum height of the list area */
    maxHeight?: string; // e.g. "16rem" (Tailwind: max-h-64)
}

const DocumentsHoverCard = ({
    documents,
    maxVisible = 5,
    maxHeight = "16rem", // default max-h-64
}: DocumentsHoverCardProps) => {
    const count = documents.length;
    const scrollable = documents.length > maxVisible;

    return (
        <HoverCard>
            {/* Trigger shows the number */}
            <HoverCardTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-sm normal-case"
                >
                    <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                    {count}
                </Button>
            </HoverCardTrigger>

            <HoverCardContent className="w-80 p-3">
                <div
                    className={`space-y-2 ${scrollable ? "overflow-y-auto" : ""}`}
                    style={scrollable ? { maxHeight } : undefined}
                >
                    {documents.map((doc) => (
                        <a
                            key={doc.id}
                            href={`/documents/view/${doc.id}`}
                            target={"_blank"}
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 rounded-md hover:bg-gray-50 p-1 transition text-primary"
                        >
                            <div className="bg-gray-100 rounded-full shrink-0">
                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{doc.title}</p>
                                {doc.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {doc.description}
                                    </p>
                                )}
                            </div>
                        </a>
                    ))}

                    {documents.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center">
                            No documents
                        </p>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default DocumentsHoverCard;
