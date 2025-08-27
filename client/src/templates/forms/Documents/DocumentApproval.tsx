import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";

const reviewHistory = [
  {
    id: 1,
    reviewer: "Jane Smith",
    date: "2025-02-20",
    status: "Approved",
    comment: "All corrections done. Document validated.",
  },
  {
    id: 2,
    reviewer: "Mark Taylor",
    date: "2025-01-10",
    status: "Rejected",
    comment: "Missing annex for risk assessment.",
  },
  {
    id: 3,
    reviewer: "Anna Johnson",
    date: "2024-12-05",
    status: "In Review",
    comment: "Ongoing check, pending additional data.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700 border-green-300";
    case "Rejected":
      return "bg-red-100 text-red-700 border-red-300";
    case "In Review":
      return "bg-blue-100 text-blue-700 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function DocumentApproval() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviewHistory.map((review) => (
          <div
            key={review.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{review.reviewer}</span>
              </div>
              <Badge className={getStatusColor(review.status)}>
                {review.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{review.date}</span>
            </div>
            <p className="mt-2 text-gray-700">{review.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
