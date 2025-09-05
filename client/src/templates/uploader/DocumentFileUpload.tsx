import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface DocumentFileUploadProps {
    value?: File[];
    onChange?: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number;
    className?: string;
    hasError?: boolean;
}

export function DocumentFileUpload({
    value = [],
    onChange,
    maxFiles = 1,
    maxSize = 10 * 1024 * 1024, // 5MB
    className,
    hasError = false,
}: DocumentFileUploadProps) {
    const [files, setFiles] = React.useState<File[]>(value);
    const { t } = useTranslation();

    React.useEffect(() => {
        setFiles(value ?? []);
    }, [value]);

    const handleChange = (newFiles: File[]) => {
        setFiles(newFiles);
        onChange?.(newFiles);
    };

    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
            description: t("components.fileUpload.errors.fileRejected", {
                name: file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name,
            }),
        });
    }, [t]);

    return (
        <FileUpload
            maxFiles={maxFiles}
            maxSize={maxSize}
            className={className ?? "w-full"}
            value={files}
            onValueChange={handleChange}
            onFileReject={onFileReject}
            multiple
        >
            <FileUploadDropzone className={cn(hasError && "border-theme-danger")}>
                <div className="flex flex-col items-center gap-1 text-center">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">{t("components.document.fileupload.title")}</p>
                    <p className="text-muted-foreground text-xs">
                        {t("components.document.fileupload.description", {
                            maxFiles,
                            maxSize: Math.floor(maxSize / 1024 / 1024),
                        })}
                    </p>
                </div>
                <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit normal-case">
                        {t("components.document.fileupload.browse")}
                    </Button>
                </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
                {files.map((file, index) => (
                    <FileUploadItem key={index} value={file}>
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata />
                        <FileUploadItemDelete asChild>
                            <Button variant="ghost" size="icon" className="size-7">
                                <X />
                            </Button>
                        </FileUploadItemDelete>
                    </FileUploadItem>
                ))}
            </FileUploadList>
        </FileUpload>
    );
}
