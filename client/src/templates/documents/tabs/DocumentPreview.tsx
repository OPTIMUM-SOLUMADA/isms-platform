import { cn } from "@/lib/utils";
import { DocumentVersion } from "@/types";
import { useMemo } from "react";
import Iframe from "react-iframe";

type Mode = 'edit' | 'view';

interface DocumentPreviewProps {
  version: DocumentVersion;
  mode?: Mode;
  className?: string;
}

const modeToUrl: Record<Mode, string> = {
  'edit': '/edit?',
  'view': '/preview?'
};

export default function DocumentPreview({
  version,
  mode = 'edit',
  className = '',
}: DocumentPreviewProps) {

  const replacer = modeToUrl[mode];
  const url = mode === 'edit' ? version.draftUrl : version.fileUrl;
  const fileUrl = useMemo(() => (url || "").replace('/edit?', replacer), [replacer, url]);

  return (
    <div className="relative w-full h-full">
      <Iframe
        url={fileUrl}
        className={cn("border-none bg-white overflow-hidden w-full min-h-[600px]", className)}
        onLoad={() => console.log("loading iframe")}
      />
    </div>
  );
}