import { useState } from 'react';
import {
  GitBranch,
  User,
  Calendar,
  MessageCircle,
  Eye,
  CheckSquare,
  XCircle,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { reviewStageIcons } from '@/constants/icon';
import { reviewItems } from '@/mocks/review';

const workflowStages = [
  { id: 'pending', label: 'Pending Review', color: 'gray' },
  { id: 'in-review', label: 'In Review', color: 'blue' },
  { id: 'approved', label: 'Approved', color: 'green' },
  { id: 'rejected', label: 'Rejected', color: 'red' }
];

export default function ReviewWorkflowPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredItems = reviewItems.filter(item => {
    const matchesSearch = item.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reviewer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'all' || item.stage === activeTab;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;

    return matchesSearch && matchesTab && matchesPriority;
  });

  const getStageIcon = (stage: string) => {
    const Icon = reviewStageIcons[stage as keyof typeof reviewStageIcons];
    return Icon;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Workflow</h1>
          <p className="text-gray-600 mt-1">Manage document review processes and approvals</p>
        </div>
        <Button className="flex items-center space-x-2">
          <GitBranch className="h-4 w-4" />
          <span>Start New Review</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {workflowStages.map((stage) => {
          const count = reviewItems.filter(item => item.stage === stage.id).length;
          const Icon = getStageIcon(stage.id);

          return (
            <Card key={stage.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stage.label}</p>
                    <p className={`text-2xl font-bold text-${stage.color}-600`}>{count}</p>
                  </div>
                  <Icon className={`h-8 w-8 text-${stage.color}-600`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents, assignees, or reviewers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Review Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({reviewItems.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({reviewItems.filter(i => i.stage === 'pending').length})</TabsTrigger>
              <TabsTrigger value="in-review">In Review ({reviewItems.filter(i => i.stage === 'in-review').length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({reviewItems.filter(i => i.stage === 'approved').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({reviewItems.filter(i => i.stage === 'rejected').length})</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const StageIcon = getStageIcon(item.stage);
                  const daysUntilDue = getDaysUntilDue(item.dueDate);

                  return (
                    <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <StageIcon className={`h-5 w-5 ${item.stage === 'pending' ? 'text-gray-500' :
                                item.stage === 'in-review' ? 'text-blue-500' :
                                  item.stage === 'approved' ? 'text-green-500' : 'text-red-500'
                                }`} />
                              <h3 className="font-semibold text-lg">{item.document}</h3>
                              <Badge variant="outline" className="text-xs">{item.type}</Badge>
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

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>Assignee: {item.assignee}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>Reviewer: {item.reviewer}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                {daysUntilDue < 0 && (
                                  <Badge variant="destructive" className="text-xs ml-1">Overdue</Badge>
                                )}
                                {daysUntilDue >= 0 && daysUntilDue <= 3 && (
                                  <Badge variant="secondary" className="text-xs ml-1">Due Soon</Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{item.comments} comments</span>
                              </div>
                            </div>

                            {item.stage === 'in-review' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Review Progress</span>
                                  <span>{item.progress}%</span>
                                </div>
                                <Progress value={item.progress} className="h-2" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                  {getInitials(item.assignee)}
                                </AvatarFallback>
                              </Avatar>
                              <Avatar className="h-8 w-8 border-2 border-white">
                                <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                  {getInitials(item.reviewer)}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {item.stage === 'pending' && (
                                <Button size="sm">
                                  <GitBranch className="h-4 w-4 mr-1" />
                                  Start Review
                                </Button>
                              )}
                              {item.stage === 'in-review' && (
                                <>
                                  <Button variant="outline" size="sm">
                                    <CheckSquare className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No review items found</h3>
                  <p className="text-gray-500">Try adjusting your filters or start a new review process</p>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}