import CircleLoading from "@/components/loading/CircleLoading";
import NotFound from "@/components/NotFound";
import { useDownloadVersion, useGetDocumentVersions } from "@/hooks/queries/useDocumentVersionMutation";
import { Document } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Download, FileText, MessageSquare, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from "@/components/ui/button";
import { format, formatRelative } from "date-fns";
import { getDateFnsLocale } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
  document: Document;
}

const DocumentVersionHistory = ({ document }: Props) => {
  const { data, isLoading, isError } = useGetDocumentVersions(document.id);

  const { mutate: download } = useDownloadVersion();
  const { t } = useTranslation();

  if (isLoading) return <CircleLoading />

  if (isError) return <div>Error</div>

  if (!data) return <NotFound />

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t("document.view.tabs.versionsHistory.content.title")}
        </CardTitle>
        <CardDescription>
          {t("document.view.tabs.versionsHistory.content.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-2">
            {data.map((version, index) => {
              const isSelected = false;

              return (
                <div key={version.id}>
                  <div
                    className={cn(
                      "group relative rounded-lg border p-3: lg:p-4 transition-all hover:border-primary hover:shadow-md cursor-pointer",
                      isSelected ? 'border-primary bg-accent' : 'bg-card'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-base">
                              {t("document.view.tabs.versionsHistory.content.item.version")} {version.version}
                            </h3>
                            {version.isCurrent && (
                              <Badge variant="default">{t("document.view.tabs.versionsHistory.content.item.currentVersion")}</Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            {version.createdBy && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                <span>{version.createdBy?.name}</span>
                              </div>
                            )}

                            {Array.isArray(version.documentReviews) && (
                              <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">
                                  {version.documentReviews.filter(e => e.comment).length}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">
                                      {formatRelative(version.createdAt, new Date(), {
                                        locale: getDateFnsLocale(),
                                      })}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{format(version.createdAt, 'PPpp', {
                                      locale: getDateFnsLocale(),
                                    })}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(version.downloadUrl || version.fileUrl) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => download({ id: version.id })}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {index < data.length - 1 && (
                    <div className="relative h-8 flex items-center justify-center">
                      <div className="absolute left-[30px] top-0 bottom-0 w-px bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default DocumentVersionHistory