import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  FileText,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { iso27001Clauses } from '@/mocks/compliance';
import { complianceStatusColors } from '@/constants/color';
import WithTitle from '@/templates/layout/WithTitle';

const statusIcons = {
  compliant: CheckCircle,
  partial: AlertTriangle,
  'non-compliant': AlertTriangle,
  'not-started': Clock
};

export default function ComplianceDashboardPage() {
  const totalClauses = iso27001Clauses.length;
  const compliantClauses = iso27001Clauses.filter(c => c.status === 'compliant').length;
  const partialClauses = iso27001Clauses.filter(c => c.status === 'partial').length;
  const overallCompliance = Math.round(iso27001Clauses.reduce((sum, clause) => sum + clause.progress, 0) / totalClauses);

  const upcomingReviews = iso27001Clauses
    .filter(clause => {
      const reviewDate = new Date(clause.nextReview);
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
                  <p className="text-2xl font-bold text-green-600">{compliantClauses}/{totalClauses}</p>
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
                  <p className="text-sm text-gray-600">Upcoming Reviews</p>
                  <p className="text-2xl font-bold text-blue-600">{upcomingReviews.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compliance Progress */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>ISO 27001 Clauses Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {iso27001Clauses.map((clause) => {
                  const StatusIcon = statusIcons[clause.status];
                  return (
                    <div key={clause.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`h-5 w-5 ${clause.status === 'compliant' ? 'text-green-600' :
                            clause.status === 'partial' ? 'text-yellow-600' :
                              clause.status === 'non-compliant' ? 'text-red-600' : 'text-gray-600'
                            }`} />
                          <div>
                            <h4 className="font-semibold">{clause.clause} - {clause.title}</h4>
                            <p className="text-sm text-gray-600">Owner: {clause.owner}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={complianceStatusColors[clause.status]}>
                            {clause.status.replace('-', ' ')}
                          </Badge>
                          <Badge
                            variant={
                              clause.priority === 'high' ? 'destructive' :
                                clause.priority === 'medium' ? 'default' : 'secondary'
                            }
                          >
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

                {upcomingReviews.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No upcoming reviews</p>
                )}
              </CardContent>
            </Card>

            {/* Compliance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Compliance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{overallCompliance}%</span>
                      <Badge variant="default" className="text-xs">+2%</Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Month</span>
                    <span className="text-sm font-medium">{overallCompliance - 2}%</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">3 Months Ago</span>
                    <span className="text-sm font-medium">{overallCompliance - 5}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h5 className="font-medium text-sm mb-2">Areas for Improvement</h5>
                  <div className="space-y-2">
                    {iso27001Clauses
                      .filter(c => c.progress < 80)
                      .sort((a, b) => a.progress - b.progress)
                      .slice(0, 3)
                      .map((clause) => (
                        <div key={clause.id} className="text-xs text-gray-600">
                          {clause.clause} - {clause.progress}%
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WithTitle>
  );
}