
import React from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

const Step3TaxDetails: React.FC<Step3Props> = ({ onNext, onBack }) => {
  const { businessInfo, updateBusinessInfo } = useBusinessContext();
  
  const formatTurnover = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    // Convert to number
    const numValue = parseInt(digits, 10) || 0;
    // Update the business info
    updateBusinessInfo({ turnover: numValue });
    // Return formatted value with commas
    return numValue.toLocaleString();
  };

  // Format the initial value
  const [formattedTurnover, setFormattedTurnover] = React.useState(() => {
    return businessInfo.turnover.toLocaleString();
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Tax Information</CardTitle>
        <CardDescription>
          Please provide your business's tax information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="turnover">Annual Turnover (Rs.)</Label>
          <Input 
            id="turnover" 
            placeholder="Enter your annual turnover" 
            value={formattedTurnover}
            onChange={(e) => {
              const formatted = formatTurnover(e.target.value);
              setFormattedTurnover(formatted);
            }}
          />
          <p className="text-xs text-muted-foreground">
            VAT registration is required if turnover exceeds Rs. 50 lakhs for goods or Rs. 20 lakhs for services
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="vat-registered" className="cursor-pointer">
              Is your business VAT registered?
            </Label>
            <p className="text-xs text-muted-foreground">
              Select yes if you have already registered for VAT
            </p>
          </div>
          <Switch 
            id="vat-registered" 
            checked={businessInfo.hasVAT}
            onCheckedChange={(checked) => updateBusinessInfo({ hasVAT: checked })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Finish</Button>
      </CardFooter>
    </Card>
  );
};

export default Step3TaxDetails;
