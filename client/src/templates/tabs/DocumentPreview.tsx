
import { ImageViewer } from "@/components/viewers/ImageViewer";
import { ExcelViewer } from "@/components/viewers/ExcelViewer";
import { PdfViewer } from "@/components/viewers/PdfViewer";
import { getFileType } from "@/lib/preview";
import { apiUrl } from "@/configs/api";
import { env } from "@/configs/env";

interface DocumentPreviewProps {
  filename: string;
}

export default function DocumentPreview({ filename }: DocumentPreviewProps) {


  // get file type from filename extension
  const fileType = getFileType(filename);
  const fileUrl = apiUrl(`${env.DOCUMENT_PREVIEW_URL}/${filename}`);

  switch (fileType) {
    case "pdf":
      return <PdfViewer url={fileUrl} />;
    case "image":
      return <ImageViewer url={fileUrl} />;
    case "excel":
      return <ExcelViewer url={fileUrl} />;
    default:
      return <div>Unsupported file type</div>;
  }
}