import { excelImageService } from "@/services/excelImageService";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentPreviewProps {
  filename: string;
}

export default function DocPreview({ filename }: DocumentPreviewProps) {


  const { data, isLoading, isError, error } = useExcelImage(filename);


  if (isLoading) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <Skeleton className="flex-grow w-full" />
        <p className="mt-4 text-muted-foreground text-sm">Loading image...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert variant="destructive" className="rounded-2xl shadow-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Failed to load</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Something went wrong while fetching the file."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-grow">
      <img
        src={data}
        alt={filename}
        className="object-contain max-w-full"
      />
    </div>
  )
}


export const useExcelImage = (filename: string) => {
  return useQuery({
    queryKey: ["excel-image", filename], // unique cache key per filename
    queryFn: () => excelImageService.get(filename).then((res) => URL.createObjectURL(res.data)),
    enabled: !!filename, // only run when filename exists
  });
};