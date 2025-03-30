
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { isPast, isToday } from 'date-fns';
import { CheckIcon, AlertCircleIcon, CalendarIcon } from 'lucide-react';

const DashboardSummary: React.FC = () => {
  const { complianceItems } = useComplianceContext();
  
  const totalTasks = complianceItems.length;
  const completedTasks = complianceItems.filter(item => item.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = complianceItems.filter(
    item => item.status === 'pending' && isPast(item.dueDate) && !isToday(item.dueDate)
  ).length;
  const dueTodayTasks = complianceItems.filter(
    item => item.status === 'pending' && isToday(item.dueDate)
  ).length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Compliance Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <div className="text-xs text-muted-foreground">All compliance requirements</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-600 flex items-center">
            <CheckIcon className="h-4 w-4 mr-1" /> Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{completedTasks}</div>
          <div className="text-xs text-green-600">{completionPercentage}% of all tasks</div>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-600 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" /> Due Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{dueTodayTasks}</div>
          <div className="text-xs text-amber-600">Tasks due today</div>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-600 flex items-center">
            <AlertCircleIcon className="h-4 w-4 mr-1" /> Overdue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{overdueTasks}</div>
          <div className="text-xs text-red-600">Tasks past their due date</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
