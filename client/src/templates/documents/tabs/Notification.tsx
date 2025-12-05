import { CheckIcon, BellIcon, FileTextIcon, AlertCircleIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { notificationService } from "@/services/notificationService"
import { Notification as NotificationType } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface NotificationProps {
  documentId: string
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "DOCUMENT_CREATED":
    case "DOCUMENT_UPDATED":
    case "DOCUMENT_APPROVED":
      return <FileTextIcon size={16} />
    case "REVIEW_NEEDED":
    case "REVIEW_OVERDUE":
      return <AlertCircleIcon size={16} />
    default:
      return <BellIcon size={16} />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "DOCUMENT_APPROVED":
    case "REVIEW_COMPLETED":
      return "bg-green-500"
    case "REVIEW_OVERDUE":
      return "bg-red-500"
    case "DOCUMENT_CREATED":
    case "DOCUMENT_UPDATED":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

export default function Notification({ documentId }: NotificationProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", documentId],
    queryFn: async () => {
      const response = await notificationService.getByDocument(documentId)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-5 text-center text-red-500">
        Erreur lors du chargement des notifications
      </div>
    )
  }

  const notifications = data?.notifications || []

  if (notifications.length === 0) {
    return (
      <div className="p-5 text-center text-muted-foreground">
        Aucune notification pour ce document
      </div>
    )
  }

  return (
    <Timeline defaultValue={notifications.length}>
      {notifications.map((notification: NotificationType, index: number) => (
        <TimelineItem
          key={notification.id}
          step={index + 1}
          className="group-data-[orientation=vertical]/timeline:ms-10 m-5"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(250%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineDate>
              {format(new Date(notification.createdAt), "d MMM yyyy", {
                locale: fr,
              })}
            </TimelineDate>
            <TimelineTitle className="flex items-center gap-2">
              {notification.title}
              {!notification.isRead && (
                <Badge variant="secondary" className="ml-2">
                  Nouveau
                </Badge>
              )}
            </TimelineTitle>
            <TimelineIndicator
              className={`${getNotificationColor(notification.type)} flex size-6 items-center justify-center border-none text-white group-data-[orientation=vertical]/timeline:-left-7`}
            >
              {notification.isRead ? (
                <CheckIcon size={16} />
              ) : (
                getNotificationIcon(notification.type)
              )}
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>{notification.message}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
