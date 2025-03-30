
import React, { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { formatNepaliDateWithEnglish } from '@/lib/nepaliDateUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Calendar: React.FC = () => {
  const { isOnboardingComplete } = useBusinessContext();
  const { complianceItems } = useComplianceContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarView, setCalendarView] = useState<"english" | "nepali">("nepali");
  
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Select Date</h2>
              
              <Tabs defaultValue="nepali" onValueChange={(value) => setCalendarView(value as "english" | "nepali")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="nepali">Nepali</TabsTrigger>
                  <TabsTrigger value="english">English</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
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
            
            <div className="mt-4 text-xs text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-sky-100 border border-sky-500"></span>
                <span>Dates with deadlines</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card className="p-6 h-full">
              <CardHeader className="pb-2 pt-0 px-0">
                <CardTitle>
                  {selectedDate ? (
                    <span>
                      {calendarView === "nepali" 
                        ? `Deadlines for ${formatNepaliDateWithEnglish(selectedDate)}`
                        : `Deadlines for ${format(selectedDate, 'MMMM d, yyyy')}`
                      }
                    </span>
                  ) : (
                    "Deadlines for Selected Date"
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-0">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
