
import React, { useState } from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ComplianceCard from '@/components/ComplianceCard';
import { useComplianceContext } from '@/contexts/ComplianceContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Checklist: React.FC = () => {
  const { isOnboardingComplete } = useBusinessContext();
  const { complianceItems } = useComplianceContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }
  
  // Get unique categories
  const categories = ['all', ...new Set(complianceItems.map(item => item.category))];
  
  // Filter items based on search term and category
  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Separate items by status
  const pendingItems = filteredItems.filter(item => item.status === 'pending');
  const completedItems = filteredItems.filter(item => item.status === 'completed');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Checklist</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Input 
                placeholder="Search compliance tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
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
          </div>
          
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pending">Pending ({pendingItems.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedItems.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingItems.map(item => (
                    <ComplianceCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending tasks found.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedItems.map(item => (
                    <ComplianceCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed tasks yet.</p>
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
