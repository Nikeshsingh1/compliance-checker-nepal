
import React from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { isOnboardingComplete, businessInfo } = useBusinessContext();
  const navigate = useNavigate();
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }

  const handleEditInfo = () => {
    toast.info('This feature will be available in the next update!');
  };
  
  const formatTurnover = (amount: number) => {
    return new Intl.NumberFormat('ne-NP', { 
      style: 'currency', 
      currency: 'NPR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <p className="text-gray-600 mt-2">View and manage your business information</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
                    <p className="mt-1">{businessInfo.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Business Type</h3>
                    <p className="mt-1 capitalize">{businessInfo.type.replace(/-/g, ' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1">{businessInfo.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="mt-1">{businessInfo.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                    <p className="mt-1">{businessInfo.registrationDate ? format(businessInfo.registrationDate, 'PPP') : 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Annual Turnover</h3>
                    <p className="mt-1">{formatTurnover(businessInfo.turnover)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">VAT Status</h3>
                    <p className="mt-1">{businessInfo.hasVAT ? 'Registered for VAT' : 'Not VAT registered'}</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleEditInfo}>Edit Business Information</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>VAT Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">VAT Status</h3>
                    <p className="mt-1">{businessInfo.hasVAT ? 'Registered' : 'Not Registered'}</p>
                  </div>
                  
                  {businessInfo.hasVAT ? (
                    <>
                      <p className="text-sm text-gray-600">
                        Your business is registered for VAT. Make sure to keep up with quarterly VAT returns and other VAT-related compliance tasks.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        Your business is currently not registered for VAT. 
                        {businessInfo.type === 'physical-goods' && businessInfo.turnover >= 5000000 && (
                          <span className="text-red-500 font-medium"> Based on your turnover, VAT registration is required.</span>
                        )}
                        {(businessInfo.type === 'service-based' || businessInfo.type === 'combined') && businessInfo.turnover >= 2000000 && (
                          <span className="text-red-500 font-medium"> Based on your turnover, VAT registration is required.</span>
                        )}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        VAT registration thresholds:
                        <br />- Rs. 50 lakhs for physical goods businesses
                        <br />- Rs. 20 lakhs for service-based businesses
                      </p>
                    </>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      onClick={handleEditInfo} 
                      className="w-full"
                    >
                      Update VAT Information
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
