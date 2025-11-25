// pages/compliance/ComplianceDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, Target, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import WithTitle from '@/templates/layout/WithTitle';

// -------------------------
// Types
// -------------------------
export type ClauseStatus = 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'NOT_STARTED';

export interface ComplianceClause {
  id: string;
  clause: string;
  title: string;
  owner: string;
  status: ClauseStatus;
  progress: number;
  documents: number;
  lastReviewed: string; // ISO date
  nextReview: string;   // ISO date
  priority: 'high' | 'medium' | 'low';
}

// -------------------------
// Mapping status to icons and colors
// -------------------------
const statusIcons: Record<ClauseStatus, React.ElementType> = {
  COMPLIANT: CheckCircle,
  PARTIAL: AlertTriangle,
  NON_COMPLIANT: AlertTriangle,
  NOT_STARTED: Clock,
};

const complianceStatusColors: Record<ClauseStatus, string> = {
  COMPLIANT: 'bg-green-100 text-green-700',
  PARTIAL: 'bg-yellow-100 text-yellow-700',
  NON_COMPLIANT: 'bg-red-100 text-red-700',
  NOT_STARTED: 'bg-gray-100 text-gray-600',
};

// -------------------------
// Component
// -------------------------
export default function ComplianceDashboardPage() {
  const [clauses, setClauses] = useState<ComplianceClause[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compliance/clauses')
      .then((res) => res.json())
      .then((data: ComplianceClause[]) => {
        setClauses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // Calculs
  const totalClauses = clauses.length;
  const compliantClauses = clauses.filter(c => c.status === 'COMPLIANT').length;
  const partialClauses = clauses.filter(c => c.status === 'PARTIAL').length;
  const overallCompliance = totalClauses === 0
    ? 0
    : Math.round(clauses.reduce((sum, clause) => sum + clause.progress, 0) / totalClauses);

  const upcomingReviews = clauses
    .filter(c => {
      const reviewDate = new Date(c.nextReview);
      const today = new Date();
      const daysUntilReview = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilReview <= 30 && daysUntilReview >= 0;
    })
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());

  return (
    <WithTitle>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">Compliance Dashboard</h1>
            <p className="page-description">ISO 27001 compliance status and progress tracking</p>
          </div>
          <Button className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-green-100">Overall Compliance</p>
                <p className="text-3xl font-bold">{overallCompliance}%</p>
              </div>
              <Target className="h-12 w-12 text-green-200" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant Clauses</p>
                <p className="text-2xl font-bold text-green-600">{compliantClauses}/{totalClauses}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partial Compliance</p>
                <p className="text-2xl font-bold text-yellow-600">{partialClauses}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Reviews</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingReviews.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
        </div>

        {/* Compliance Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {clauses.map((clause) => {
              const StatusIcon = statusIcons[clause.status];
              return (
                <Card key={clause.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 ${
                        clause.status === 'COMPLIANT' ? 'text-green-600' :
                        clause.status === 'PARTIAL' ? 'text-yellow-600' :
                        clause.status === 'NON_COMPLIANT' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                      <div>
                        <h4 className="font-semibold">{clause.clause} - {clause.title}</h4>
                        <p className="text-sm text-gray-600">Owner: {clause.owner}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={complianceStatusColors[clause.status]}>
                        {clause.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={
                        clause.priority === 'high' ? 'destructive' :
                        clause.priority === 'medium' ? 'default' : 'secondary'
                      }>
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

                  <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{clause.documents} documents</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last reviewed: {new Date(clause.lastReviewed).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span>Next review: {new Date(clause.nextReview).toLocaleDateString()}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Sidebar: Upcoming Reviews */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Upcoming Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingReviews.slice(0, 5).map((clause) => {
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
                {upcomingReviews.length === 0 && <p className="text-center text-gray-500 py-4">No upcoming reviews</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WithTitle>
  );
}
