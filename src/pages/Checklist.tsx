
import React, { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ComplianceCard from '@/components/ComplianceCard';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BanknoteIcon, CarIcon, LightbulbIcon, CheckIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { formatNepaliDateShort } from '@/lib/nepaliDateUtils';

const Checklist: React.FC = () => {
  const { isOnboardingComplete } = useBusinessContext();
  const { 
    complianceItems, 
    loanRepayments, 
    vehicleRenewals, 
    utilityPayments, 
    markLoanRepaymentComplete, 
    markVehicleRenewalComplete,
    markUtilityPaymentComplete
  } = useComplianceContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [itemType, setItemType] = useState('compliance');
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }
  
  // Get unique categories
  const categories = ['all', ...new Set(complianceItems.map(item => item.category))];
  
  // Filter compliance items based on search term and category
  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Filter loan repayments based on search term
  const filteredLoans = loanRepayments.filter(loan => 
    loan.loanName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter vehicle renewals based on search term
  const filteredVehicles = vehicleRenewals.filter(vehicle => 
    vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter utility payments based on search term
  const filteredUtilities = utilityPayments.filter(utility => 
    utility.utilityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    utility.providerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Separate items by status based on selected type
  let pendingItems: any[] = [];
  let completedItems: any[] = [];
  
  if (itemType === 'compliance') {
    pendingItems = filteredItems.filter(item => item.status === 'pending');
    completedItems = filteredItems.filter(item => item.status === 'completed');
  } else if (itemType === 'loan') {
    pendingItems = filteredLoans.filter(loan => loan.status === 'pending');
    completedItems = filteredLoans.filter(loan => loan.status === 'completed');
  } else if (itemType === 'vehicle') {
    pendingItems = filteredVehicles.filter(vehicle => vehicle.status === 'pending');
    completedItems = filteredVehicles.filter(vehicle => vehicle.status === 'completed');
  } else if (itemType === 'utility') {
    pendingItems = filteredUtilities.filter(utility => utility.status === 'pending');
    completedItems = filteredUtilities.filter(utility => utility.status === 'completed');
  }
  
  // Render a loan repayment card
  const renderLoanCard = (loan: any) => (
    <Card key={loan.id} className="overflow-hidden">
      <CardHeader className="bg-blue-50 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <BanknoteIcon className="h-5 w-5 mr-2 text-blue-600" />
            {loan.loanName}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Next Payment: {formatNepaliDateShort(loan.nextDueDate)}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="text-sm">Amount: NPR {loan.amount.toLocaleString()}</p>
          <p className="text-sm">Frequency: {loan.frequency.charAt(0).toUpperCase() + loan.frequency.slice(1)}</p>
          <p className="text-sm">Due in {formatDistanceToNow(loan.nextDueDate)}</p>
          
          {loan.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2 w-full"
              onClick={() => markLoanRepaymentComplete(loan.id)}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  // Render a vehicle renewal card
  const renderVehicleCard = (vehicle: any) => (
    <Card key={vehicle.id} className="overflow-hidden">
      <CardHeader className="bg-green-50 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <CarIcon className="h-5 w-5 mr-2 text-green-600" />
            {vehicle.vehicleName}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Registration: {vehicle.registrationNumber}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="text-sm">Next Renewal: {formatNepaliDateShort(vehicle.nextRenewalDate)}</p>
          <p className="text-sm">Last Renewed: {formatNepaliDateShort(vehicle.lastRenewalDate)}</p>
          <p className="text-sm">Due in {formatDistanceToNow(vehicle.nextRenewalDate)}</p>
          
          {vehicle.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2 w-full"
              onClick={() => markVehicleRenewalComplete(vehicle.id)}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Mark as Renewed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  // Render a utility payment card
  const renderUtilityCard = (utility: any) => (
    <Card key={utility.id} className="overflow-hidden">
      <CardHeader className="bg-yellow-50 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <LightbulbIcon className="h-5 w-5 mr-2 text-yellow-600" />
            {utility.utilityName}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Provider: {utility.providerName}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="text-sm">Amount: NPR {utility.amount.toLocaleString()}</p>
          <p className="text-sm">Frequency: {utility.frequency.charAt(0).toUpperCase() + utility.frequency.slice(1)}</p>
          <p className="text-sm">Next Payment: {formatNepaliDateShort(utility.nextDueDate)}</p>
          <p className="text-sm">Due in {formatDistanceToNow(utility.nextDueDate)}</p>
          
          {utility.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2 w-full"
              onClick={() => markUtilityPaymentComplete(utility.id)}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Checklist</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-auto flex-grow">
              <Input 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-auto flex-grow">
              <Select value={itemType} onValueChange={setItemType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliance">Compliance Items</SelectItem>
                  <SelectItem value="loan">Loan Repayments</SelectItem>
                  <SelectItem value="vehicle">Vehicle Renewals</SelectItem>
                  <SelectItem value="utility">Utility Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {itemType === 'compliance' && (
              <div className="w-full md:w-auto flex-grow">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pending">Pending ({pendingItems.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedItems.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itemType === 'compliance' && 
                    pendingItems.map(item => <ComplianceCard key={item.id} item={item} />)}
                  
                  {itemType === 'loan' && 
                    pendingItems.map(loan => renderLoanCard(loan))}
                  
                  {itemType === 'vehicle' && 
                    pendingItems.map(vehicle => renderVehicleCard(vehicle))}
                    
                  {itemType === 'utility' && 
                    pendingItems.map(utility => renderUtilityCard(utility))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending items found.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itemType === 'compliance' && 
                    completedItems.map(item => <ComplianceCard key={item.id} item={item} />)}
                  
                  {itemType === 'loan' && 
                    completedItems.map(loan => renderLoanCard(loan))}
                  
                  {itemType === 'vehicle' && 
                    completedItems.map(vehicle => renderVehicleCard(vehicle))}
                    
                  {itemType === 'utility' && 
                    completedItems.map(utility => renderUtilityCard(utility))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed items yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Checklist;
