
import React, { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useComplianceContext, LoanRepayment, VehicleRenewal } from '@/contexts/ComplianceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays, isBefore, parseISO } from 'date-fns';
import { CheckIcon, ClockIcon, BellIcon, MailIcon, PhoneIcon, PlusIcon, Trash2Icon, CarIcon, BanknoteIcon } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatNepaliDateShort } from '@/lib/nepaliDateUtils';

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s]+$/, "Phone number can only contain numbers, +, and spaces")
});

const loanSchema = z.object({
  loanName: z.string().min(1, "Loan name is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  startDate: z.date(),
  frequency: z.enum(['monthly', 'quarterly', 'half-yearly', 'annually']),
  nextDueDate: z.date()
});

const vehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  lastRenewalDate: z.date(),
  nextRenewalDate: z.date()
});

const Reminders: React.FC = () => {
  const { isOnboardingComplete, businessInfo } = useBusinessContext();
  const { 
    complianceItems, 
    loanRepayments, 
    vehicleRenewals,
    addLoanRepayment,
    updateLoanRepayment,
    removeLoanRepayment,
    markLoanRepaymentComplete,
    addVehicleRenewal,
    updateVehicleRenewal,
    removeVehicleRenewal,
    markVehicleRenewalComplete
  } = useComplianceContext();
  
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('compliance');

  const [isSmsEnabled, setIsSmsEnabled] = useState(
    localStorage.getItem('smsRemindersEnabled') === 'true'
  );
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem('reminderPhoneNumber') || ''
  );
  
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: phoneNumber
    }
  });
  
  const loanForm = useForm<z.infer<typeof loanSchema>>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanName: '',
      amount: 0,
      startDate: new Date(),
      frequency: 'monthly',
      nextDueDate: new Date()
    }
  });
  
  const vehicleForm = useForm<z.infer<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleName: '',
      registrationNumber: '',
      lastRenewalDate: new Date(),
      nextRenewalDate: new Date()
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
  
  const handleAddLoan = (values: z.infer<typeof loanSchema>) => {
    addLoanRepayment({
      loanName: values.loanName,
      amount: values.amount,
      startDate: values.startDate,
      frequency: values.frequency,
      nextDueDate: values.nextDueDate,
      status: 'pending'
    });
    setLoanDialogOpen(false);
    loanForm.reset();
    toast.success('Loan repayment schedule added');
  };
  
  const handleRemoveLoan = (id: string) => {
    removeLoanRepayment(id);
    toast.success('Loan repayment schedule removed');
  };
  
  const handleMarkLoanPaid = (id: string) => {
    markLoanRepaymentComplete(id);
    toast.success('Loan payment marked as complete and next due date updated');
  };
  
  const handleAddVehicle = (values: z.infer<typeof vehicleSchema>) => {
    addVehicleRenewal({
      vehicleName: values.vehicleName,
      registrationNumber: values.registrationNumber,
      lastRenewalDate: values.lastRenewalDate,
      nextRenewalDate: values.nextRenewalDate,
      status: 'pending'
    });
    setVehicleDialogOpen(false);
    vehicleForm.reset();
    toast.success('Vehicle bluebook renewal schedule added');
  };
  
  const handleRemoveVehicle = (id: string) => {
    removeVehicleRenewal(id);
    toast.success('Vehicle bluebook reminder removed');
  };
  
  const handleVehicleRenewed = (id: string) => {
    markVehicleRenewalComplete(id);
    toast.success('Vehicle bluebook renewal completed and next year\'s reminder set');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600 mt-2">Manage email and SMS notifications for deadlines and payments</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="loans">Loan Repayments</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicle Renewals</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Compliance Deadlines</CardTitle>
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
                              <span>Due on {formatNepaliDateShort(item.dueDate)}</span>
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
                    <p className="text-gray-500">No upcoming compliance deadlines in the next 30 days.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="loans" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Loan Repayments</h2>
              <Button onClick={() => setLoanDialogOpen(true)} className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                <span>Add Loan</span>
              </Button>
            </div>
            
            {loanRepayments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loanRepayments.map(loan => (
                  <Card key={loan.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{loan.loanName}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveLoan(loan.id)} 
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Amount:</span>
                          <span className="font-medium">NPR {loan.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Frequency:</span>
                          <span className="capitalize">{loan.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Next Payment:</span>
                          <span>{formatNepaliDateShort(loan.nextDueDate)}</span>
                        </div>
                        
                        <Button 
                          className="w-full mt-4" 
                          onClick={() => handleMarkLoanPaid(loan.id)}
                        >
                          <BanknoteIcon className="h-4 w-4 mr-1" />
                          Mark as Paid
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BanknoteIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No loan repayment schedules added yet.</p>
                  <Button onClick={() => setLoanDialogOpen(true)}>
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Loan Repayment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Vehicle Bluebook Renewals</h2>
              <Button onClick={() => setVehicleDialogOpen(true)} className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                <span>Add Vehicle</span>
              </Button>
            </div>
            
            {vehicleRenewals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicleRenewals.map(vehicle => (
                  <Card key={vehicle.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{vehicle.vehicleName}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveVehicle(vehicle.id)} 
                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Registration:</span>
                          <span className="font-medium">{vehicle.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last Renewal:</span>
                          <span>{formatNepaliDateShort(vehicle.lastRenewalDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Next Renewal:</span>
                          <span>{formatNepaliDateShort(vehicle.nextRenewalDate)}</span>
                        </div>
                        
                        <Button 
                          className="w-full mt-4" 
                          onClick={() => handleVehicleRenewed(vehicle.id)}
                        >
                          <CarIcon className="h-4 w-4 mr-1" />
                          Mark as Renewed
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No vehicle bluebook renewals added yet.</p>
                  <Button onClick={() => setVehicleDialogOpen(true)}>
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Vehicle
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </TabsContent>
        </Tabs>
      </main>
      
      {/* SMS Dialog */}
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable SMS Reminders</DialogTitle>
            <DialogDescription>
              Enter your phone number to receive SMS reminders about upcoming compliance deadlines.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handleEnableSmsReminders)} className="space-y-4">
              <FormField
                control={phoneForm.control}
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
      
      {/* Loan Dialog */}
      <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Loan Repayment</DialogTitle>
            <DialogDescription>
              Add details about your loan to receive payment reminders.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...loanForm}>
            <form onSubmit={loanForm.handleSubmit(handleAddLoan)} className="space-y-4">
              <FormField
                control={loanForm.control}
                name="loanName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business Expansion Loan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loanForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installment Amount (NPR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loanForm.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loanForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatNepaliDateShort(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loanForm.control}
                name="nextDueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatNepaliDateShort(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setLoanDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Loan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Vehicle Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vehicle Bluebook Renewal</DialogTitle>
            <DialogDescription>
              Add your vehicle details to receive bluebook renewal reminders.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...vehicleForm}>
            <form onSubmit={vehicleForm.handleSubmit(handleAddVehicle)} className="space-y-4">
              <FormField
                control={vehicleForm.control}
                name="vehicleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company SUV" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={vehicleForm.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="BA 1 CHA 2345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={vehicleForm.control}
                name="lastRenewalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Renewal Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatNepaliDateShort(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={vehicleForm.control}
                name="nextRenewalDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Next Renewal Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatNepaliDateShort(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setVehicleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Vehicle
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
