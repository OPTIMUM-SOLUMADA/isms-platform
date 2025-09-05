import React, { useEffect, useRef, useState } from "react";
import { Space } from "react-zoomable-ui";
import { excelImageService } from "@/services/excelImageService";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

interface ZoomableIframeProps {
    url: string; // URL of your generated HTML
    maxWidth?: number;
    defaultHeight?: number;
}

export const ExcelViewer: React.FC<ZoomableIframeProps> = ({
    url,
    maxWidth = 640,
    defaultHeight = 100,
}) => {

    const { data, isLoading, isPending } = useExcelImage(url.split("/").pop() || "");

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [height, setHeight] = useState(defaultHeight);
    const [width, setWidth] = useState(maxWidth);

    // Fetch HTML using Axios
    useEffect(() => {
        if (!data) return;
        setHtmlContent(data.html);
    }, [data]);

    // Auto-resize iframe
    const onLoad = () => {
        try {
            const iframe = iframeRef.current;
            if (iframe?.contentWindow?.document.body) {
                const {
                    scrollHeight,
                    scrollWidth
                } = iframe.contentWindow.document.body;
                setWidth(scrollWidth + 20);
                setHeight(scrollHeight + 20);
            }
        } catch {
            console.warn("Cannot access iframe content");
        }
    };

    return (
        <div
            className="grow overflow-hidden w-full relative border min-h-[400px] flex justify-center items-center"
        >
            {(isLoading || isPending) ? (
                <Skeleton className="h-full w-full absolute inset-0" />
            ) : (
                <Space
                    style={{ width: "100%", height: "100%" }}
                    className="bg-gray-900/70"
                >
                    <iframe
                        ref={iframeRef}
                        srcDoc={htmlContent}
                        onLoad={onLoad}
                        height={height}
                        width={width}
                        className="border-none block absolute pointer-events-none shadow-lg bg-white overflow-hidden"
                        scrolling="no"
                    />
                </Space>
            )}
        </div>
    );
};



export const useExcelImage = (filename: string) => {
    return useQuery<{ html: string }>({
        queryKey: ["excel-image", filename], // unique cache key per filename
        queryFn: () => excelImageService.get(filename).then((res) => res.data),
        enabled: !!filename, // only run when filename exists
    });
};