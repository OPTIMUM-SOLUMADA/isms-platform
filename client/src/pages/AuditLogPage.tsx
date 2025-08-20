import { useState } from 'react';
import {
  Activity,
  Search,
  Download,
  Calendar,
  User,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { auditEntries } from '@/mocks/audit';
import { resourceTypeColors, statusColors } from '@/constants/color';
import WithTitle from '@/templates/layout/WithTitle';

const actionIcons = {
  'Document Approved': CheckCircle,
  'Document Modified': Edit,
  'Document Created': Plus,
  'Document Deleted': Trash2,
  'User Login': User,
  'User Logout': User,
  'Failed Login Attempt': AlertTriangle,
  'Review Started': Activity,
  'Review Completed': CheckCircle,
  'User Permissions Updated': User,
  'System Backup': Activity,
  'System Maintenance': Activity
};

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResourceType, setFilterResourceType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = filterAction === 'all' || entry.action === filterAction;
    const matchesResourceType = filterResourceType === 'all' || entry.resourceType === filterResourceType;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesUser = filterUser === 'all' || entry.user === filterUser;

    return matchesSearch && matchesAction && matchesResourceType && matchesStatus && matchesUser;
  });

  const getActionIcon = (action: string) => {
    const Icon = actionIcons[action as keyof typeof actionIcons] || Activity;
    return Icon;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const uniqueUsers = [...new Set(auditEntries.map(entry => entry.user))];
  const uniqueActions = [...new Set(auditEntries.map(entry => entry.action))];

  return (
    <WithTitle title="Audit Log">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
            <p className="text-gray-600 mt-1">Track all system activities and changes for compliance</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Log</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{auditEntries.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success</p>
                  <p className="text-2xl font-bold text-green-600">
                    {auditEntries.filter(e => e.status === 'success').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {auditEntries.filter(e => e.status === 'warning').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Events</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {auditEntries.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by resource, user, action, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterResourceType} onValueChange={setFilterResourceType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map(user => (
                      <SelectItem key={user} value={user}>{user}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Entries */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const ActionIcon = getActionIcon(entry.action);
                  const { date, time } = formatTimestamp(entry.timestamp);

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{date}</div>
                          <div className="text-gray-500">{time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {entry.user !== 'System' ? (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getInitials(entry.user)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Activity className="h-4 w-4 text-gray-600" />
                            </div>
                          )}
                          <span className="text-sm font-medium">{entry.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ActionIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{entry.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium max-w-xs truncate" title={entry.resource}>
                          {entry.resource}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={resourceTypeColors[entry.resourceType]}>
                          {entry.resourceType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[entry.status]}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 font-mono">{entry.ipAddress}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate" title={entry.details}>
                          {entry.details}
                        </div>
                        {entry.changes && entry.changes.length > 0 && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              {entry.changes.length} changes
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredEntries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit entries found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </WithTitle>
  );
}