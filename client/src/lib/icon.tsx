import {
    FileIcon,
    FileVideoIcon,
    FileAudioIcon,
    FileTextIcon,
    FileCodeIcon,
    FileArchiveIcon,
    FileCogIcon,
    FileSpreadsheet,
    FileText,
} from "lucide-react";

export function getFileIconByName(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

    if (["mp4", "avi", "mkv", "mov"].includes(extension)) {
        return <FileVideoIcon />;
    }

    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        return <FileAudioIcon />;
    }

    if (["txt", "md", "rtf", "pdf"].includes(extension)) {
        return <FileTextIcon className="text-theme-danger" />;
    }

    if (["html", "css", "js", "jsx", "ts", "tsx", "json", "xml", "php", "py", "rb", "java", "c", "cpp", "cs"].includes(extension)) {
        return <FileCodeIcon />;
    }

    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
        return <FileArchiveIcon />;
    }

    if (["xls", "xlsx"].includes(extension)) {
        return <FileSpreadsheet className="text-theme" />; // Excel icon placeholder
    }

    if (["doc", "docx"].includes(extension)) {
        return <FileText className="text-theme-2" />; // Word icon placeholder
    }

    if (["ppt", "pptx"].includes(extension)) {
        return <FileIcon className="text-orange-600" />; // PowerPoint icon placeholder
    }

    // default fallback
    return <FileCogIcon />;
}
