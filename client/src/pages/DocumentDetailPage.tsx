import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  BadgeCheck,
  Layers,
  Calendar,
  RefreshCw,
  FileText,
  Clock,
  History,
  Link,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import DocPreview from "@/templates/forms/Documents/DocPreview";
import Notification from "@/templates/forms/Documents/Notification";
import DocumentApproval from "@/templates/forms/Documents/DocumentApproval";
import AuditLog from "@/templates/forms/Documents/AuditLog";

export default function DocumentDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("preview");

  const tabs = [
    { id: "preview", label: "Document Preview", icon: FileText },
    { id: "notification", label: "Notification", icon: Clock },
    { id: "documentApproval", label: "Document Approval", icon: History },
    { id: "auditLog", label: "AuditLog", icon: Link },
  ];

  // Exemple data (à remplacer par fetch API plus tard)
  const document = {
    title: "Access Control Procedure",
    owner: "John Doe",
    reviewer: "Jane Smith",
    status: "Approved",
    version: "v2.1",
    lastUpdated: "2025-02-25",
    nextReview: "2026-02-25",
  };

  // couleurs selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "In Review":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Expired":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="flex flex-col p-6 space-y-6 h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-gray-500 text-sm">
              Owner: {document.owner} | Version: {document.version}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>

      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Owner:</span>
              <span>{document.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Reviewer:</span>
              <span>{document.reviewer}</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Status:</span>
              <Badge className={`${getStatusColor(document.status)}`}>
                {document.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Version:</span>
              <span>{document.version}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Last updated:</span>
              <span>{document.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Next review due:</span>
              <span>{document.nextReview}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Layout: sidebar + content */}
      <div className="flex flex-1 min-h-0 gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="outline"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 justify-start min-w-max md:min-w-0 ${
                  activeTab === tab.id
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-grow p-6 bg-gray-50 rounded-lg shadow-inner">
          {activeTab === "preview" &&  <DocPreview /> }
          {activeTab === "notification" && <Notification /> }
          {activeTab === "documentApproval" && <DocumentApproval /> }
          {activeTab === "auditLog" && <AuditLog /> }
        </div>
      </div>
    </div>
  );
}
