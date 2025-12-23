import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Shield,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WithTitle from "@/templates/layout/WithTitle";
import { complianceStatusColors } from "@/constants/color";
import { useFetchCompliance } from "@/hooks/queries/useComplianceQueries";

const statusIcons = {
  COMPLIANT: CheckCircle,
  PARTIALLY_COMPLIANT: AlertTriangle,
  NON_COMPLIANT: AlertTriangle,
  NOT_APPLICABLE: Clock,
};

export default function ComplianceDashboard() {
  const { data: clauses = [], isLoading } = useFetchCompliance();

  // Overview stats

      console.log("clauses", clauses);
      
  return (
    <WithTitle>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">Compliance Dashboard</h1>
            <p className="page-description">ISO 27001 compliance overview</p>
          </div>
        </div>

        {/* Clauses List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>ISO 27001 Clauses Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
            {isLoading && <p>Loading clauses...</p>}
            {clauses.map((clause) => {
              const StatusIcon = statusIcons[clause.status];
              return (                    
                <div key={clause.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <StatusIcon
                          className={`h-5 w-5 ${
                            clause.status === "COMPLIANT"
                              ? "text-green-600"
                              : clause.status === "NON_COMPLIANT"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        />
                        <div>
                          <h4 className="font-semibold">
                            {clause.document.title}
                          </h4>
                          {/* <p className="text-sm text-gray-600">Owner: {clause.owner?.name || "N/A"}</p> */}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={complianceStatusColors[clause.status]}>
                          {clause.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <hr />
                      <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{clause.isoClause.code} - {clause.isoClause.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Last reviewed: {clause.lastReviewed ? new Date(clause.lastReviewed).toLocaleDateString() : "N/A"}</span>
                          </div>
                        </div>
                        <span>Next review: {clause.nextReview ? new Date(clause.nextReview).toLocaleDateString() : "N/A"}</span>
                      </div>
                </div>
              );
            })}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Upcoming Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Upcoming Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* {upcomingReviews.slice(0, 5).map((clause) => {
                  const daysUntilReview = Math.ceil(
                    (new Date(clause.nextReview).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div key={clause.id} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-sm">{clause.clause} - {clause.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">Owner: {clause.owner}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Due: {new Date(clause.nextReview).toLocaleDateString()}
                        </span>
                        <Badge variant={daysUntilReview <= 7 ? 'destructive' : 'secondary'} className="text-xs">
                          {daysUntilReview} days
                        </Badge>
                      </div>
                    </div>
                  );
                })}

                {upcomingReviews.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No upcoming reviews</p>
                )} */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WithTitle>
  );
}
