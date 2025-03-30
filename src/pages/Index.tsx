
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import OnboardingWizard from '@/components/OnboardingWizard';

const Index: React.FC = () => {
  const { isOnboardingComplete } = useBusinessContext();
  
  if (isOnboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <OnboardingWizard />;
};

export default Index;
