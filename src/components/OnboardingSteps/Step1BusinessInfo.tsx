
import React from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Step1Props {
  onNext: () => void;
}

const Step1BusinessInfo: React.FC<Step1Props> = ({ onNext }) => {
  const { businessInfo, updateBusinessInfo } = useBusinessContext();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const handleNext = () => {
    // Validate fields
    const newErrors: Record<string, string> = {};
    
    if (!businessInfo.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    
    if (!businessInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(businessInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!businessInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onNext();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Let's start with some basic information about your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input 
            id="business-name" 
            placeholder="Enter your business name" 
            value={businessInfo.name}
            onChange={(e) => {
              updateBusinessInfo({ name: e.target.value });
              if (errors.name) {
                setErrors({ ...errors, name: '' });
              }
            }}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Business Type</Label>
          <RadioGroup 
            defaultValue={businessInfo.type}
            onValueChange={(value) => updateBusinessInfo({ type: value as any })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="physical-goods" id="physical-goods" />
              <Label htmlFor="physical-goods">Physical Goods Business</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="service-based" id="service-based" />
              <Label htmlFor="service-based">Service-Based Business</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="combined" id="combined" />
              <Label htmlFor="combined">Combined Goods & Services</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-email">Email</Label>
          <Input 
            id="business-email" 
            type="email" 
            placeholder="Enter business email" 
            value={businessInfo.email}
            onChange={(e) => {
              updateBusinessInfo({ email: e.target.value });
              if (errors.email) {
                setErrors({ ...errors, email: '' });
              }
            }}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="business-phone">Phone Number</Label>
          <Input 
            id="business-phone" 
            placeholder="Enter phone number" 
            value={businessInfo.phone}
            onChange={(e) => {
              updateBusinessInfo({ phone: e.target.value });
              if (errors.phone) {
                setErrors({ ...errors, phone: '' });
              }
            }}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} className="w-full">Next</Button>
      </CardFooter>
    </Card>
  );
};

export default Step1BusinessInfo;
