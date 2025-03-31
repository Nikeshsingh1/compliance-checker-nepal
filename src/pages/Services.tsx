
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLinkIcon, PhoneIcon } from 'lucide-react';
import { serviceCategories } from '@/lib/services-data';
import { toast } from 'sonner';

const Services: React.FC = () => {
  const { isOnboardingComplete } = useBusinessContext();
  
  if (!isOnboardingComplete) {
    return <Navigate to="/" replace />;
  }

  const handleContactClick = (contactInfo: string) => {
    navigator.clipboard.writeText(contactInfo);
    toast.success(`Contact number ${contactInfo} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Services</h1>
          <p className="text-gray-600 mt-2">
            Professional services offered by UBS Nepal for your business needs
          </p>
        </div>

        <Tabs defaultValue={serviceCategories[0].id.toString()} className="w-full">
          <div className="mb-8">
            <TabsList className="w-full sm:w-auto">
              {serviceCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id.toString()}
                  className="flex-1 sm:flex-initial"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {serviceCategories.map(category => (
            <TabsContent key={category.id} value={category.id.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map(service => (
                  <Card key={service.id} className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>
                        {service.price && <span className="font-medium text-primary">{service.price}</span>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-2">
                      {service.contactInfo && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center w-full justify-start"
                          onClick={() => handleContactClick(service.contactInfo!)}
                        >
                          <PhoneIcon className="h-3 w-3 mr-2" />
                          <span>{service.contactInfo}</span>
                        </Button>
                      )}
                      
                      {service.url && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full flex items-center justify-center"
                          onClick={() => window.open(service.url, '_blank')}
                        >
                          <span>View Service Details</span>
                          <ExternalLinkIcon className="h-3 w-3 ml-2" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Services;
