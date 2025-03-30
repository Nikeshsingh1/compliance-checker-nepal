
import React from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DashboardSummary from '@/components/DashboardSummary';
import UpcomingDeadlines from '@/components/UpcomingDeadlines';
import { Card } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { formatNepaliDateShort } from '@/lib/nepaliDateUtils';

const Dashboard: React.FC = () => {
  const { isOnboardingComplete, businessInfo } = useBusinessContext();
  const today = new Date();
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {businessInfo.name}</h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your compliance status
          </p>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Today's Date (Nepali): {formatNepaliDateShort(today)}</span>
          </div>
        </div>
        
        <DashboardSummary />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Compliance Overview</h2>
              <p className="mb-4">
                This dashboard helps you track and manage your business's compliance requirements in Nepal. Stay on top of deadlines and ensure your business remains fully compliant with all regulations.
              </p>
              
              <h3 className="text-lg font-medium mt-6 mb-2">Getting Started</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Check the <strong>Upcoming Deadlines</strong> panel to see what needs attention soon</li>
                <li>Visit the <strong>Checklist</strong> page to see all compliance tasks</li>
                <li>Mark items as complete as you fulfill requirements</li>
                <li>View the <strong>Calendar</strong> to see a timeline of upcoming deadlines</li>
              </ul>
            </div>
          </div>
          
          <div>
            <UpcomingDeadlines />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
