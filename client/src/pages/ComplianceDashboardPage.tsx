import { useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WithTitle from "@/templates/layout/WithTitle";
import { complianceStatusColors } from "@/constants/color";
import { ComplianceClause } from "@/types";
import { useCreateCompliance, useDeleteCompliance, useFetchCompliance, useUpdateCompliance } from "@/hooks/queries/useComplianceQueries";

const statusIcons = {
  COMPLIANT: CheckCircle,
  PARTIALLY_COMPLIANT: AlertTriangle,
  NON_COMPLIANT: AlertTriangle,
  NOT_APPLICABLE: Clock,
};

export default function ComplianceDashboard() {
  const { data: clauses = [], isLoading } = useFetchCompliance();

  const [selectedClause, setSelectedClause] = useState<ComplianceClause | null>(null);

  // Hooks for CRUD
  const createMutation = useCreateCompliance();
  const updateMutation = useUpdateCompliance();
  const deleteMutation = useDeleteCompliance();

  // Overview stats
  const totalClauses = clauses.length;
  const compliantClauses = clauses.filter(c => c.status === "COMPLIANT").length;
  const partialClauses = clauses.filter(c => c.status === "PARTIALLY_COMPLIANT").length;
  const overallCompliance =
    totalClauses > 0
      ? Math.round(clauses.reduce((sum, c) => sum + c.progress, 0) / totalClauses)
      : 0;

  return (
    <WithTitle>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">Compliance Dashboard</h1>
            <p className="page-description">ISO 27001 compliance overview</p>
          </div>
          {/* <Button
            onClick={() =>
              createMutation.mutate({
                clause: "A.X.X",
                title: "New Clause",
                progress: 0,
                status: "NOT_APPLICABLE",
                documents: 0,
                priority: "MEDIUM",
              })
            }
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Add Clause</span>
          </Button> */}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Overall Compliance</p>
                  <p className="text-3xl font-bold">{overallCompliance}%</p>
                </div>
                <Target className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliant Clauses</p>
                  <p className="text-2xl font-bold text-green-600">
                    {compliantClauses}/{totalClauses}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Partial Compliance</p>
                  <p className="text-2xl font-bold text-yellow-600">{partialClauses}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Clauses</p>
                  <p className="text-2xl font-bold text-blue-600">{totalClauses}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clauses List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading && <p>Loading clauses...</p>}
          {clauses.map((clause) => {
            const StatusIcon = statusIcons[clause.status];
            return (
              <Card key={clause.id}>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <StatusIcon
                        className={`h-5 w-5 ${
                          clause.status === "COMPLIANT"
                            ? "text-green-600"
                            : clause.status === "PARTIALLY_COMPLIANT"
                            ? "text-yellow-600"
                            : clause.status === "NON_COMPLIANT"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold">
                          {clause.clause} - {clause.title}
                        </h4>
                        <p className="text-sm text-gray-600">Owner: {clause.ownerId || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={complianceStatusColors[clause.status]}>
                        {clause.status.replace("_", " ")}
                      </Badge>
                      <Badge variant={clause.priority === "HIGH" ? "destructive" : clause.priority === "MEDIUM" ? "default" : "secondary"}>
                        {clause.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{clause.progress}%</span>
                    </div>
                    <Progress value={clause.progress} className="h-2" />
                  </div>

                  <div className="flex justify-end space-x-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedClause(clause)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate({ id: clause.id })}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </WithTitle>
  );
}
