
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComplianceItem, useComplianceContext } from '@/contexts/ComplianceContext';
import { isPast, isToday, addDays } from 'date-fns';
import { CheckIcon, ClockIcon, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNepaliDateShort } from '@/lib/nepaliDateUtils';

interface ComplianceCardProps {
  item: ComplianceItem;
}

const ComplianceCard: React.FC<ComplianceCardProps> = ({ item }) => {
  const { markCompleted, markPending } = useComplianceContext();
  
  const isDue = isPast(item.dueDate) && !isToday(item.dueDate);
  const isDueToday = isToday(item.dueDate);
  const isSoon = !isPast(item.dueDate) && isPast(addDays(new Date(), -14));
  
  const getStatusBadge = () => {
    if (item.status === 'completed') {
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
    } else if (isDue) {
      return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>;
    } else if (isDueToday) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Due Today</Badge>;
    } else if (isSoon) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Coming Soon</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const getCardClass = () => {
    if (item.status === 'completed') {
      return "deadline-complete";
    } else if (isDue) {
      return "deadline-urgent";
    } else if (isDueToday || isSoon) {
      return "deadline-soon";
    }
    return "";
  };

  return (
    <Card className={cn("transition-all", getCardClass())}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription className="mt-1">
              {item.category}
            </CardDescription>
          </div>
          <div>{getStatusBadge()}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{item.description}</p>
        <div className="flex items-center mt-3 text-sm">
          <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-gray-700">
            Due: {formatNepaliDateShort(item.dueDate)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        {item.status === 'completed' ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => markPending(item.id)}
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            Mark as Pending
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={() => markCompleted(item.id)}
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            Mark as Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ComplianceCard;
