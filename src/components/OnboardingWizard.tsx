
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import Step1BusinessInfo from './OnboardingSteps/Step1BusinessInfo';
import Step2RegistrationDetails from './OnboardingSteps/Step2RegistrationDetails';
import Step3TaxDetails from './OnboardingSteps/Step3TaxDetails';
import { toast } from 'sonner';

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { completeOnboarding } = useBusinessContext();
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    completeOnboarding();
    toast.success('Onboarding completed successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl font-bold text-center text-gray-900">ComplianceTracker Nepal</h1>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-primary' : 'bg-gray-300'
              }`}>
                <span className="text-white font-medium text-sm">1</span>
              </div>
              <span className="ml-2 text-sm font-medium">Business Info</span>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200">
              <div className={`h-full ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: currentStep >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-primary' : 'bg-gray-300'
              }`}>
                <span className="text-white font-medium text-sm">2</span>
              </div>
              <span className="ml-2 text-sm font-medium">Registration</span>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200">
              <div className={`h-full ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: currentStep >= 3 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 3 ? 'bg-primary' : 'bg-gray-300'
              }`}>
                <span className="text-white font-medium text-sm">3</span>
              </div>
              <span className="ml-2 text-sm font-medium">Tax Details</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full transition-all duration-300">
        {currentStep === 1 && <Step1BusinessInfo onNext={handleNext} />}
        {currentStep === 2 && <Step2RegistrationDetails onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <Step3TaxDetails onNext={handleFinish} onBack={handleBack} />}
      </div>
    </div>
  );
};

export default OnboardingWizard;
