
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CheckIcon, PhoneIcon, BanknoteIcon, CarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNepaliDateShort } from '@/lib/nepaliDateUtils';
import { toast } from 'sonner';

const UpcomingDeadlines: React.FC = () => {
  const { 
    upcomingDeadlines, 
    markCompleted,
    loanRepayments,
    vehicleRenewals,
    markLoanRepaymentComplete,
    markVehicleRenewalComplete
  } = useComplianceContext();
  
  const handleSendSmsReminder = (title: string) => {
    const phoneNumber = localStorage.getItem('reminderPhoneNumber');
    if (!phoneNumber || localStorage.getItem('smsRemindersEnabled') !== 'true') {
      toast.error('SMS reminders not enabled. Please enable them in the reminders page.');
      return;
    }
    
    toast.success(`SMS reminder sent for: ${title}`);
  };
  
  // Check if item ID is from loan or vehicle
  const isLoanItem = (id: string) => id.startsWith('loan-');
  const isVehicleItem = (id: string) => id.startsWith('vehicle-');
  
  const handleCompleteItem = (id: string) => {
    if (isLoanItem(id)) {
      const loanId = id.replace('loan-', '');
      markLoanRepaymentComplete(loanId);
      toast.success('Loan payment marked as completed');
    } else if (isVehicleItem(id)) {
      const vehicleId = id.replace('vehicle-', '');
      markVehicleRenewalComplete(vehicleId);
      toast.success('Vehicle bluebook renewal marked as completed');
    } else {
      markCompleted(id);
    }
  };
  
  // Get icon based on item type
  const getItemIcon = (id: string) => {
    if (isLoanItem(id)) return <BanknoteIcon className="h-3 w-3 mr-1" />;
    if (isVehicleItem(id)) return <CarIcon className="h-3 w-3 mr-1" />;
    return <CheckIcon className="h-3 w-3 mr-1" />;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingDeadlines.length > 0 ? (
          <div className="space-y-4">
            {upcomingDeadlines.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{formatNepaliDateShort(item.dueDate)}</p>
                    <p className="text-xs text-muted-foreground">
                      Due in {formatDistanceToNow(item.dueDate)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendSmsReminder(item.title)}
                      className="flex items-center"
                      title="Send SMS reminder"
                    >
                      <PhoneIcon className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCompleteItem(item.id)}
                      className="flex items-center"
                    >
                      {getItemIcon(item.id)}
                      <span className="text-xs">Complete</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No upcoming deadlines.</p>
            <p className="text-sm">Great job! You're all caught up.</p>
          </div>
        )}
        
        <div className="mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link to="/reminders">Manage All Reminders</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;
