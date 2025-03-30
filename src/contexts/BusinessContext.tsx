
import React, { createContext, useState, useContext, ReactNode } from 'react';

type BusinessType = 'physical-goods' | 'service-based' | 'combined';

export interface BusinessInfo {
  name: string;
  type: BusinessType;
  registrationDate: Date | null;
  turnover: number;
  hasVAT: boolean;
  email: string;
  phone: string;
}

interface BusinessContextType {
  businessInfo: BusinessInfo;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;
  isOnboardingComplete: boolean;
  completeOnboarding: () => void;
}

const defaultBusinessInfo: BusinessInfo = {
  name: '',
  type: 'physical-goods',
  registrationDate: null,
  turnover: 0,
  hasVAT: false,
  email: '',
  phone: '',
};

const BusinessContext = createContext<BusinessContextType>({
  businessInfo: defaultBusinessInfo,
  updateBusinessInfo: () => {},
  isOnboardingComplete: false,
  completeOnboarding: () => {},
});

export const useBusinessContext = () => useContext(BusinessContext);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    const saved = localStorage.getItem('businessInfo');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert registration date string back to Date object if it exists
      if (parsed.registrationDate) {
        parsed.registrationDate = new Date(parsed.registrationDate);
      }
      return parsed;
    }
    return defaultBusinessInfo;
  });
  
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });

  const updateBusinessInfo = (info: Partial<BusinessInfo>) => {
    const updatedInfo = { ...businessInfo, ...info };
    setBusinessInfo(updatedInfo);
    localStorage.setItem('businessInfo', JSON.stringify(updatedInfo));
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem('onboardingComplete', 'true');
  };

  return (
    <BusinessContext.Provider value={{ 
      businessInfo, 
      updateBusinessInfo,
      isOnboardingComplete,
      completeOnboarding 
    }}>
      {children}
    </BusinessContext.Provider>
  );
};
