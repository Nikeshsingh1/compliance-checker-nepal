
import React, { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';

const Calendar: React.FC = () => {
  const { isOnboardingComplete } = useBusinessContext();
  const { complianceItems } = useComplianceContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }
  
  // Get deadlines for the selected date
  const selectedDateDeadlines = complianceItems.filter(
    item => selectedDate && isSameDay(item.dueDate, selectedDate)
  );
  
  // Function to check if a date has deadlines
  const hasDueItems = (date: Date) => {
    return complianceItems.some(item => isSameDay(item.dueDate, date));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Calendar</h1>
          <p className="text-gray-600 mt-2">View all your upcoming compliance deadlines</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Select Date</h2>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasDeadline: (date) => hasDueItems(date),
              }}
              modifiersStyles={{
                hasDeadline: {
                  backgroundColor: 'rgba(14, 165, 233, 0.1)',
                  fontWeight: 'bold',
                  border: '1px solid rgba(14, 165, 233, 0.5)',
                }
              }}
            />
          </div>
          
          <div className="md:col-span-2">
            <Card className="p-6 h-full">
              <h2 className="font-semibold mb-4">
                Deadlines for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
              </h2>
              
              {selectedDateDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateDeadlines.map(item => (
                    <div key={item.id} className="p-4 border rounded-md bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{item.title}</h3>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Category: {item.category}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-gray-500">No deadlines for this date.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
