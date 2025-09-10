import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, FileText, Clock, ArrowRight } from "lucide-react";

interface AuditLogItem {
  id: string;
  user?: { id: string; name: string };
  eventType: string;
  document?: { id: string; title: string };
  details?: Record<string, any> | null; // ✅ accepte null;
  timestamp: string;
}

// Exemple de données statiques (à remplacer par fetch API plus tard)
const auditLogs: AuditLogItem[] = [
  {
    id: "1",
    user: { id: "u1", name: "Jane Smith" },
    eventType: "STATUS_CHANGE",
    document: { id: "d1", title: "Access Control Procedure" },
    details: { oldStatus: "DRAFT", newStatus: "IN_REVIEW" },
    timestamp: "2025-02-24T10:15:00Z",
  },
  {
    id: "2",
    user: { id: "u2", name: "John Doe" },
    eventType: "COMMENT_ADDED",
    document: { id: "d1", title: "Access Control Procedure" },
    details: { comment: "Added missing annex." },
    timestamp: "2025-02-22T14:45:00Z",
  },
  {
    id: "3",
    user: { id: "u3", name: "Anna Johnson" },
    eventType: "DOCUMENT_CREATED",
    document: { id: "d2", title: "Risk Assessment Form" },
    details: null,
    timestamp: "2025-02-20T09:00:00Z",
  },
];

export default function AuditLog() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-gray-300 pl-6 space-y-6">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative">
              {/* Timeline dot */}
              <span className="absolute -left-[10px] top-2 h-4 w-4 rounded-full bg-blue-500 border-2 border-white"></span>

              {/* Content */}
              <div className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {log.user?.name ?? "Unknown User"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(log.timestamp).toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{log.document?.title ?? "No Document"}</span>
                </div>

                {/* Event Type + Details */}
                <div className="mt-2 text-sm">
                  <span className="font-semibold text-gray-800">
                    {log.eventType}
                  </span>
                  {log.details && (
                    <div className="mt-1 text-gray-600 text-sm">
                      {log.details.oldStatus && log.details.newStatus ? (
                        <div className="flex items-center gap-2">
                          <span>{log.details.oldStatus}</span>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                          <span>{log.details.newStatus}</span>
                        </div>
                      ) : (
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
