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
  const fileUrl = useMemo(() => (version.fileUrl || "").replace('/edit?', replacer), [version, replacer]);

  return (
    <Iframe
      url={fileUrl}
      className={cn("border-none shadow-lg bg-white overflow-hidden w-full min-h-[600px]", className)}
    />
  );
}