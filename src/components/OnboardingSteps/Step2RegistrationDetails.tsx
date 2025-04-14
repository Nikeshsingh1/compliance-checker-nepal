
import React from 'react';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NepaliCalendar } from '@/components/ui/nepali-calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNepaliDateShort } from '@/lib/nepaliDateUtils';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const Step2RegistrationDetails: React.FC<Step2Props> = ({ onNext, onBack }) => {
  const { businessInfo, updateBusinessInfo } = useBusinessContext();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleNext = () => {
    // Validate fields
    const newErrors: Record<string, string> = {};
    
    if (!businessInfo.registrationDate) {
      newErrors.registrationDate = 'Registration date is required';
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
        <CardTitle>Registration Details</CardTitle>
        <CardDescription>
          Please provide information about your business registration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Company Registration Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !businessInfo.registrationDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {businessInfo.registrationDate ? (
                  formatNepaliDateShort(businessInfo.registrationDate)
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <NepaliCalendar
                mode="single"
                selected={businessInfo.registrationDate || undefined}
                onSelect={(date) => {
                  updateBusinessInfo({ registrationDate: date });
                  if (errors.registrationDate) {
                    setErrors({ ...errors, registrationDate: '' });
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.registrationDate && <p className="text-sm text-red-500">{errors.registrationDate}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </CardFooter>
    </Card>
  );
};

export default Step2RegistrationDetails;
