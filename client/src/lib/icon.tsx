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

export function getFileIconByName(fileName: string, size?: number) {
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
    const iconSize = size || 22;

    if (["mp4", "avi", "mkv", "mov"].includes(extension)) {
        return <FileVideoIcon size={iconSize}/>;
    }

    if (["mp3", "wav", "ogg", "flac"].includes(extension)) {
        return <FileAudioIcon size={iconSize}/>;
    }

    if (["txt", "md", "rtf", "pdf"].includes(extension)) {
        return <FileTextIcon className="text-theme-danger" size={iconSize}/>;
    }

    if (["html", "css", "js", "jsx", "ts", "tsx", "json", "xml", "php", "py", "rb", "java", "c", "cpp", "cs"].includes(extension)) {
        return <FileCodeIcon size={iconSize}/>;
    }

    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
        return <FileArchiveIcon size={iconSize}/>;
    }

    if (["xls", "xlsx"].includes(extension)) {
        return <FileSpreadsheet className="text-theme" size={iconSize}/>; // Excel icon placeholder
    }

    if (["doc", "docx"].includes(extension)) {
        return <FileText className="text-theme-2" size={iconSize}/>; // Word icon placeholder
    }

    if (["ppt", "pptx"].includes(extension)) {
        return <FileIcon className="text-orange-600" size={iconSize}/>; // PowerPoint icon placeholder
    }

    // default fallback
    return <FileCogIcon size={iconSize}/>;
}
