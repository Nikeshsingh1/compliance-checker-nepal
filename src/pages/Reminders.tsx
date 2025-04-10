
import React, { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays, isBefore } from 'date-fns';
import { CheckIcon, ClockIcon, BellIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s]+$/, "Phone number can only contain numbers, +, and spaces")
});

const Reminders: React.FC = () => {
  const { isOnboardingComplete, businessInfo } = useBusinessContext();
  const { complianceItems } = useComplianceContext();
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [isSmsEnabled, setIsSmsEnabled] = useState(
    localStorage.getItem('smsRemindersEnabled') === 'true'
  );
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem('reminderPhoneNumber') || ''
  );
  
  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: phoneNumber
    }
  });
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }
  
  // Get upcoming deadlines (next 30 days)
  const today = new Date();
  const in30Days = addDays(today, 30);
  
  const upcomingDeadlines = complianceItems
    .filter(item => 
      item.status === 'pending' && 
      isBefore(today, item.dueDate) && 
      isBefore(item.dueDate, in30Days)
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
  const handleEnableEmailReminders = () => {
    toast.success('Email reminders enabled for ' + businessInfo.email);
  };
  
  const handleSendTestReminder = () => {
    toast.success('Test reminder sent to ' + businessInfo.email);
  };

  const handleEnableSmsReminders = (values: z.infer<typeof phoneSchema>) => {
    setPhoneNumber(values.phoneNumber);
    setIsSmsEnabled(true);
    localStorage.setItem('smsRemindersEnabled', 'true');
    localStorage.setItem('reminderPhoneNumber', values.phoneNumber);
    setSmsDialogOpen(false);
    toast.success('SMS reminders enabled for ' + values.phoneNumber);
  };
  
  const handleSendTestSms = () => {
    if (!phoneNumber) {
      toast.error('Please enable SMS reminders first');
      return;
    }
    toast.success('Test SMS reminder sent to ' + phoneNumber);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Reminders</h1>
          <p className="text-gray-600 mt-2">Manage email and SMS notifications for upcoming deadlines</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadline Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length > 0 ? (
                  <div className="divide-y">
                    {upcomingDeadlines.map(item => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>Due on {format(item.dueDate, 'MMMM d, yyyy')}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="flex items-center">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            <span>Complete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No upcoming deadlines in the next 30 days.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MailIcon className="h-5 w-5 mr-2" />
                  <span>Email Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Email Address</p>
                  <p className="text-sm text-gray-600">{businessInfo.email}</p>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={handleEnableEmailReminders}
                    className="w-full flex items-center justify-center mb-2"
                  >
                    <MailIcon className="h-4 w-4 mr-2" />
                    <span>Enable Email Reminders</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSendTestReminder}
                    className="w-full"
                  >
                    Send Test Email
                  </Button>
                </div>
                
                <div className="pt-4">
                  <p className="text-xs text-gray-500">
                    Reminders will be sent 7 days before, 3 days before, and on the day of each deadline.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  <span>SMS Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSmsEnabled && phoneNumber ? (
                  <div>
                    <p className="text-sm font-medium mb-1">Phone Number</p>
                    <p className="text-sm text-gray-600">{phoneNumber}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    SMS notifications are not enabled.
                  </p>
                )}
                
                <div className="pt-2">
                  <Button 
                    onClick={() => setSmsDialogOpen(true)}
                    className="w-full flex items-center justify-center mb-2"
                    variant={isSmsEnabled ? "outline" : "default"}
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{isSmsEnabled ? "Update Phone Number" : "Enable SMS Reminders"}</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSendTestSms}
                    className="w-full"
                    disabled={!isSmsEnabled}
                  >
                    Send Test SMS
                  </Button>
                </div>
                
                <div className="pt-4">
                  <p className="text-xs text-gray-500">
                    SMS notifications are sent 2 days before and on the day of each deadline.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable SMS Reminders</DialogTitle>
            <DialogDescription>
              Enter your phone number to receive SMS reminders about upcoming compliance deadlines.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEnableSmsReminders)} className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+977 98XXXXXXXX" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSmsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Enable SMS Reminders
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reminders;

