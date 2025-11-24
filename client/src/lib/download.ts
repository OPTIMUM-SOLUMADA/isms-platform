export function downloadBlob(
    blob: Blob,
    contentDisposition?: string,
    defaultFilename = "downloaded-file"
) {
    try {
        // Extract filename from content-disposition if available
        let filename = defaultFilename;

        if (contentDisposition && contentDisposition.includes("filename=")) {
            filename = contentDisposition
                .split("filename=")[1]
                .trim()
                .replace(/["']/g, "");
        }

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        // Required for Firefox
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        console.log(`File download initiated: ${filename}`);
    } catch (error) {
        console.error("Error downloading file:", error);
    }
}
