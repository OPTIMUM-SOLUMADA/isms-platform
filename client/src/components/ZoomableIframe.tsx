import React, { useEffect, useRef, useState } from "react";
import { Space } from "react-zoomable-ui";
import axios from "@/lib/axios";

interface ZoomableIframeProps {
    url: string; // URL of your generated HTML
    maxWidth?: number;
    defaultHeight?: number;
}

export const ZoomableIframe: React.FC<ZoomableIframeProps> = ({
    url,
    maxWidth = 640,
    defaultHeight = 100,
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [height, setHeight] = useState(defaultHeight);
    const [width, setWidth] = useState(maxWidth);

    // Fetch HTML using Axios
    useEffect(() => {
        axios
            .get(url)
            .then((res) => setHtmlContent(res.data))
            .catch((err) => console.error("Error fetching HTML:", err));
    }, [url]);

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
            style={{
                transition: "height 0.3s ease",
            }}
            className="grow overflow-hidden w-full relative border min-h-[400px] bg-gray-900/70 flex justify-center items-center"
        >
            <Space style={{ width: "100%", height: "100%" }} className="">
                <iframe
                    ref={iframeRef}
                    srcDoc={htmlContent}
                    onLoad={onLoad}
                    height={height}
                    width={width}
                    className="border-none block absolute pointer-events-none shadow-lg bg-white"
                    scrolling="no"
                />
            </Space>
        </div>
    );
};
