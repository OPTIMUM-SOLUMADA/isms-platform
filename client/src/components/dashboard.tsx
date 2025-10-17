

import { useDocument } from "@/contexts/DocumentContext";
import { useFetchPendingReviews } from "@/hooks/queries/usePendingReviewsMutations";
import { useFetchUsers } from "@/hooks/queries/useUserMutations";
import { FileText, Clock, Users, Shield } from "lucide-react";

import { Card, CardContent } from '@/components/ui/card';
export default function DashboardStats() {
  const { documents } = useDocument();
  const { data } = useFetchUsers();
  const { data: pending } = useFetchPendingReviews();

  const activeUsers =
    data?.data?.users?.filter((user: any) => user.isActive) || [];


  const stats = [
    {
      title: "Total Documents",
      value: documents.length ?? 0,
      change: "+12",
      changeType: "increase" as const,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Pending Reviews",
      value: pending?.length ?? 0,
      change: "-5",
      changeType: "decrease" as const,
      icon: Clock,
      color: "amber",
    },
    {
      title: "Compliance Score",
      value: "94%",
      change: "+2%",
      changeType: "increase" as const,
      icon: Shield,
      color: "green",
    },
    {
      title: "Active Users",
      value: activeUsers.length,
      change: "+8",
      changeType: "increase" as const,
      icon: Users,
      color: "purple",
    },
  ];

  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-2xl font-bold">{stat.value}</span>
                        {/* <Badge
                          variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {/* {stat.change} * / }
                        </Badge> */}
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
  );
}

// export const stats = [
//     {
//         title: 'Total Documents',
//         value: '247',
//         change: '+12',
//         changeType: 'increase' as const,
//         icon: FileText,
//         color: 'blue'
//     },
//     {
//         title: 'Pending Reviews',
//         value: '18',
//         change: '-5',
//         changeType: 'decrease' as const,
//         icon: Clock,
//         color: 'amber'
//     },
//     {
//         title: 'Compliance Score',
//         value: '94%',
//         change: '+2%',
//         changeType: 'increase' as const,
//         icon: Shield,
//         color: 'green'
//     },
//     {
//         title: 'Active Users',
//         value: '156',
//         change: '+8',
//         changeType: 'increase' as const,
//         icon: Users,
//         color: 'purple'
//     }
// ];

export const recentActivities = [
    {
        id: 1,
        action: 'Document approved',
        document: 'Security Incident Response Plan v2.1',
        user: 'Sarah Johnson',
        time: '2 hours ago',
        type: 'approval'
    },
    {
        id: 2,
        action: 'Review started',
        document: 'Access Control Policy',
        user: 'Mike Chen',
        time: '4 hours ago',
        type: 'review'
    },
    {
        id: 3,
        action: 'New document uploaded',
        document: 'Business Continuity Plan',
        user: 'Emma Davis',
        time: '1 day ago',
        type: 'upload'
    },
    {
        id: 4,
        action: 'Risk assessment updated',
        document: 'Annual Risk Register',
        user: 'David Wilson',
        time: '2 days ago',
        type: 'update'
    }
];

export const upcomingDeadlines = [
    {
        id: 1,
        document: 'Information Classification Policy',
        deadline: '2025-01-15',
        owner: 'Alice Cooper',
        priority: 'high' as const
    },
    {
        id: 2,
        document: 'Vendor Management Procedure',
        deadline: '2025-01-18',
        owner: 'Bob Martinez',
        priority: 'medium' as const
    },
    {
        id: 3,
        document: 'Backup and Recovery Plan',
        deadline: '2025-01-22',
        owner: 'Carol Lee',
        priority: 'low' as const
    }
];

export const complianceProgress = [
    { clause: 'A.5 Information Security Policies', progress: 100 },
    { clause: 'A.6 Organization of Information Security', progress: 95 },
    { clause: 'A.7 Human Resource Security', progress: 88 },
    { clause: 'A.8 Asset Management', progress: 92 },
    { clause: 'A.9 Access Control', progress: 85 },
    { clause: 'A.10 Cryptography', progress: 78 }
];