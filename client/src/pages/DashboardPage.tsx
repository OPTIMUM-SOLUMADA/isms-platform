import {
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { complianceProgress, recentActivities, upcomingDeadlines } from '@/mocks/dashboard';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DashboardStats from '@/components/dashboard';



export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <WithTitle title={t("dashboard.title")}>
      <div className="space-y-6">
        {/* Stats Cards */}

        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.document}</p>
                    <p className="text-xs text-gray-500 mt-1">Owner: {item.owner}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(item.deadline).toLocaleDateString()}</p>
                  </div>
                  <Badge
                    variant={
                      item.priority === 'high' ? 'destructive' :
                        item.priority === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Deadlines
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${activity.type === 'approval' ? 'bg-green-500' :
                    activity.type === 'review' ? 'bg-blue-500' :
                      activity.type === 'upload' ? 'bg-purple-500' : 'bg-amber-500'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.document}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Compliance Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Compliance Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceProgress.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate">{item.clause}</span>
                    <span className="text-gray-600">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View Compliance Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button asChild className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/documents/add" className="flex flex-col items-center space-y-2 text-white hover:text-white no-underline">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">New Document</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Clock className="h-6 w-6" />
                <span className="text-xs">Schedule Review</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <CheckCircle className="h-6 w-6" />
                <span className="text-xs">Approve Policy</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/users" className="flex flex-col items-center space-y-2 text-black hover:text-black no-underline">
                  <Users className="h-6 w-6" />
                  <span className="text-xs">Manage Users</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Shield className="h-6 w-6" />
                <span className="text-xs">Risk Assessment</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <TrendingUp className="h-6 w-6" />
                <span className="text-xs">Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </WithTitle>
  );
}