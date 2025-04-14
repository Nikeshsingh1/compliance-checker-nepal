
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBusinessContext } from './BusinessContext';
import { addMonths, addDays, format, isAfter, isBefore, endOfDay, addYears } from 'date-fns';

export interface ComplianceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed';
  priority: 'normal' | 'urgent' | 'soon';
  requiresVAT?: boolean;
}

export interface LoanRepayment {
  id: string;
  loanName: string;
  startDate: Date;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'half-yearly' | 'annually';
  nextDueDate: Date;
  status: 'pending' | 'completed';
}

export interface VehicleRenewal {
  id: string;
  vehicleName: string;
  registrationNumber: string;
  lastRenewalDate: Date;
  nextRenewalDate: Date;
  status: 'pending' | 'completed';
}

interface ComplianceContextType {
  complianceItems: ComplianceItem[];
  loanRepayments: LoanRepayment[];
  vehicleRenewals: VehicleRenewal[];
  markCompleted: (id: string) => void;
  markPending: (id: string) => void;
  upcomingDeadlines: ComplianceItem[];
  addLoanRepayment: (loan: Omit<LoanRepayment, 'id'>) => void;
  updateLoanRepayment: (loan: LoanRepayment) => void;
  removeLoanRepayment: (id: string) => void;
  markLoanRepaymentComplete: (id: string) => void;
  addVehicleRenewal: (vehicle: Omit<VehicleRenewal, 'id'>) => void;
  updateVehicleRenewal: (vehicle: VehicleRenewal) => void;
  removeVehicleRenewal: (id: string) => void;
  markVehicleRenewalComplete: (id: string) => void;
}

const ComplianceContext = createContext<ComplianceContextType>({
  complianceItems: [],
  loanRepayments: [],
  vehicleRenewals: [],
  markCompleted: () => {},
  markPending: () => {},
  upcomingDeadlines: [],
  addLoanRepayment: () => {},
  updateLoanRepayment: () => {},
  removeLoanRepayment: () => {},
  markLoanRepaymentComplete: () => {},
  addVehicleRenewal: () => {},
  updateVehicleRenewal: () => {},
  removeVehicleRenewal: () => {},
  markVehicleRenewalComplete: () => {},
});

export const useComplianceContext = () => useContext(ComplianceContext);

export const ComplianceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { businessInfo } = useBusinessContext();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<ComplianceItem[]>([]);
  const [loanRepayments, setLoanRepayments] = useState<LoanRepayment[]>([]);
  const [vehicleRenewals, setVehicleRenewals] = useState<VehicleRenewal[]>([]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedLoans = localStorage.getItem('loanRepayments');
    if (savedLoans) {
      const parsedLoans = JSON.parse(savedLoans);
      // Convert string dates back to Date objects
      const loansWithDates = parsedLoans.map((loan: any) => ({
        ...loan,
        startDate: new Date(loan.startDate),
        nextDueDate: new Date(loan.nextDueDate)
      }));
      setLoanRepayments(loansWithDates);
    }

    const savedVehicles = localStorage.getItem('vehicleRenewals');
    if (savedVehicles) {
      const parsedVehicles = JSON.parse(savedVehicles);
      const vehiclesWithDates = parsedVehicles.map((vehicle: any) => ({
        ...vehicle,
        lastRenewalDate: new Date(vehicle.lastRenewalDate),
        nextRenewalDate: new Date(vehicle.nextRenewalDate)
      }));
      setVehicleRenewals(vehiclesWithDates);
    }
  }, []);

  // Generate compliance items based on business info
  useEffect(() => {
    if (!businessInfo.registrationDate) return;

    const registrationDate = new Date(businessInfo.registrationDate);
    const today = new Date();
    const items: ComplianceItem[] = [];

    // Load saved compliance statuses
    const savedStatuses = JSON.parse(localStorage.getItem('complianceStatuses') || '{}');

    // 1. PAN Registration
    items.push({
      id: 'pan-registration',
      category: 'Registration',
      title: 'PAN Registration',
      description: 'Register your business with the Inland Revenue Department to obtain a Permanent Account Number (PAN).',
      dueDate: registrationDate,
      status: savedStatuses['pan-registration'] || 'pending',
      priority: 'urgent'
    });

    // 2. VAT Registration (if applicable)
    if ((businessInfo.type === 'physical-goods' && businessInfo.turnover >= 5000000) || 
        ((businessInfo.type === 'service-based' || businessInfo.type === 'combined') && businessInfo.turnover >= 2000000) ||
        businessInfo.hasVAT) {
      const vatDueDate = addDays(registrationDate, 30);
      items.push({
        id: 'vat-registration',
        category: 'Registration',
        title: 'VAT Registration',
        description: 'Register for Value Added Tax (VAT) with the IRD.',
        dueDate: vatDueDate,
        status: savedStatuses['vat-registration'] || 'pending',
        priority: isAfter(today, vatDueDate) ? 'urgent' : 'normal',
        requiresVAT: true
      });
    }

    // 3. Board of Directors Formation
    const bodDueDate = addMonths(registrationDate, 3);
    items.push({
      id: 'board-formation',
      category: 'Companies Act Compliance',
      title: 'Formation of Board of Directors',
      description: 'Form the Board of Directors and submit meeting minutes confirming appointments to OCR.',
      dueDate: bodDueDate,
      status: savedStatuses['board-formation'] || 'pending',
      priority: isAfter(today, bodDueDate) ? 'urgent' : isBefore(bodDueDate, addDays(today, 14)) ? 'soon' : 'normal'
    });

    // 4. Auditor Appointment
    const auditorDueDate = addMonths(registrationDate, 3);
    items.push({
      id: 'auditor-appointment',
      category: 'Companies Act Compliance',
      title: 'Appointment of Auditor',
      description: 'Appoint an auditor within 15 days and submit details to OCR.',
      dueDate: auditorDueDate,
      status: savedStatuses['auditor-appointment'] || 'pending',
      priority: isAfter(today, auditorDueDate) ? 'urgent' : isBefore(auditorDueDate, addDays(today, 14)) ? 'soon' : 'normal'
    });

    // 5. Share Allotment
    const shareDueDate = addMonths(registrationDate, 3);
    items.push({
      id: 'share-allotment',
      category: 'Companies Act Compliance',
      title: 'Share Allotment and Share Lagat',
      description: 'Complete share allotment and submit details to OCR.',
      dueDate: shareDueDate,
      status: savedStatuses['share-allotment'] || 'pending',
      priority: isAfter(today, shareDueDate) ? 'urgent' : isBefore(shareDueDate, addDays(today, 14)) ? 'soon' : 'normal'
    });

    // 6. Director's Disclosure
    const disclosureDueDate = addDays(registrationDate, 7);
    items.push({
      id: 'director-disclosure',
      category: 'Companies Act Compliance',
      title: 'Director\'s Disclosure',
      description: 'Submit director disclosures to OCR within seven days of assuming office.',
      dueDate: disclosureDueDate,
      status: savedStatuses['director-disclosure'] || 'pending',
      priority: isAfter(today, disclosureDueDate) ? 'urgent' : 'normal'
    });

    // 7. Registered Office Address
    const officeDueDate = addMonths(registrationDate, 3);
    items.push({
      id: 'office-address',
      category: 'Companies Act Compliance',
      title: 'Registered Office Address',
      description: 'Submit registered office address details to OCR.',
      dueDate: officeDueDate,
      status: savedStatuses['office-address'] || 'pending',
      priority: isAfter(today, officeDueDate) ? 'urgent' : isBefore(officeDueDate, addDays(today, 14)) ? 'soon' : 'normal'
    });

    // 8. Bank Account Opening
    items.push({
      id: 'bank-account',
      category: 'Banking',
      title: 'Company Bank Account Opening',
      description: 'Open a company bank account immediately after registration.',
      dueDate: registrationDate,
      status: savedStatuses['bank-account'] || 'pending',
      priority: isAfter(today, registrationDate) ? 'urgent' : 'normal'
    });

    // 9. Ward Office Registration
    const wardDueDate = addDays(registrationDate, 15);
    items.push({
      id: 'ward-registration',
      category: 'Registration',
      title: 'Ward Office Registration',
      description: 'Register your business with the local ward office.',
      dueDate: wardDueDate,
      status: savedStatuses['ward-registration'] || 'pending',
      priority: isAfter(today, wardDueDate) ? 'urgent' : 'normal'
    });

    // 10. VAT Quarterly Returns (if applicable)
    if (businessInfo.hasVAT) {
      // Calculate next quarter end based on today
      const currentMonth = today.getMonth();
      let quarterEndMonth;
      
      if (currentMonth < 3) quarterEndMonth = 3; // End of first quarter (April)
      else if (currentMonth < 7) quarterEndMonth = 7; // End of second quarter (August)
      else if (currentMonth < 11) quarterEndMonth = 11; // End of third quarter (December)
      else quarterEndMonth = 3; // End of fourth quarter (next year April)
      
      const quarterEnd = new Date(today.getFullYear(), quarterEndMonth, 25);
      if (isBefore(quarterEnd, today)) {
        quarterEnd.setFullYear(quarterEnd.getFullYear() + 1);
      }
      
      items.push({
        id: 'vat-returns',
        category: 'Tax Compliance',
        title: 'Quarterly VAT Returns',
        description: 'File quarterly VAT returns (Purchase and Sale Register) by the 25th of the month following each quarter.',
        dueDate: quarterEnd,
        status: savedStatuses['vat-returns'] || 'pending',
        priority: isBefore(quarterEnd, addDays(today, 14)) ? 'soon' : 'normal',
        requiresVAT: true
      });
    }

    setComplianceItems(items);

    // Add loan repayments and vehicle renewals to upcoming deadlines if they're due soon
    // Using the same 'today' instance to avoid redeclaration
    const combinedItems: ComplianceItem[] = [...complianceItems];
    
    // Add loan repayments to the list
    loanRepayments.forEach(loan => {
      if (loan.status === 'pending' && isBefore(today, loan.nextDueDate)) {
        combinedItems.push({
          id: `loan-${loan.id}`,
          category: 'Loan Repayment',
          title: `${loan.loanName} Payment Due`,
          description: `Loan repayment of NPR ${loan.amount.toLocaleString()} is due.`,
          dueDate: loan.nextDueDate,
          status: 'pending',
          priority: isBefore(loan.nextDueDate, addDays(today, 7)) ? 'urgent' : 'normal'
        });
      }
    });

    // Add vehicle renewals to the list
    vehicleRenewals.forEach(vehicle => {
      if (vehicle.status === 'pending' && isBefore(today, vehicle.nextRenewalDate)) {
        combinedItems.push({
          id: `vehicle-${vehicle.id}`,
          category: 'Vehicle Registration',
          title: `${vehicle.vehicleName} Bluebook Renewal`,
          description: `Vehicle bluebook renewal for ${vehicle.registrationNumber} is due.`,
          dueDate: vehicle.nextRenewalDate,
          status: 'pending',
          priority: isBefore(vehicle.nextRenewalDate, addDays(today, 14)) ? 'urgent' : 'normal'
        });
      }
    });

    // Update upcoming deadlines
    const upcoming = combinedItems
      .filter(item => item.status !== 'completed' && isBefore(today, item.dueDate))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
    
    setUpcomingDeadlines(upcoming);
    
  }, [businessInfo, complianceItems, loanRepayments, vehicleRenewals]);

  const markCompleted = (id: string) => {
    const updatedItems = complianceItems.map(item => 
      item.id === id ? { ...item, status: 'completed' as const } : item
    );
    setComplianceItems(updatedItems);
    
    // Update localStorage
    const statuses = JSON.parse(localStorage.getItem('complianceStatuses') || '{}');
    statuses[id] = 'completed';
    localStorage.setItem('complianceStatuses', JSON.stringify(statuses));
    
    // Update upcoming deadlines
    const today = new Date();
    const upcoming = updatedItems
      .filter(item => item.status !== 'completed' && isBefore(today, item.dueDate))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
    
    setUpcomingDeadlines(upcoming);
  };

  const markPending = (id: string) => {
    const updatedItems = complianceItems.map(item => 
      item.id === id ? { ...item, status: 'pending' as const } : item
    );
    setComplianceItems(updatedItems);
    
    // Update localStorage
    const statuses = JSON.parse(localStorage.getItem('complianceStatuses') || '{}');
    statuses[id] = 'pending';
    localStorage.setItem('complianceStatuses', JSON.stringify(statuses));
    
    // Update upcoming deadlines
    const today = new Date();
    const upcoming = updatedItems
      .filter(item => item.status !== 'completed' && isBefore(today, item.dueDate))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
    
    setUpcomingDeadlines(upcoming);
  };

  // Loan repayment functions
  const addLoanRepayment = (loan: Omit<LoanRepayment, 'id'>) => {
    const newLoan: LoanRepayment = {
      ...loan,
      id: `loan-${Date.now()}`
    };
    
    const updatedLoans = [...loanRepayments, newLoan];
    setLoanRepayments(updatedLoans);
    localStorage.setItem('loanRepayments', JSON.stringify(updatedLoans));
  };

  const updateLoanRepayment = (loan: LoanRepayment) => {
    const updatedLoans = loanRepayments.map(item => 
      item.id === loan.id ? loan : item
    );
    setLoanRepayments(updatedLoans);
    localStorage.setItem('loanRepayments', JSON.stringify(updatedLoans));
  };

  const removeLoanRepayment = (id: string) => {
    const updatedLoans = loanRepayments.filter(loan => loan.id !== id);
    setLoanRepayments(updatedLoans);
    localStorage.setItem('loanRepayments', JSON.stringify(updatedLoans));
  };

  const markLoanRepaymentComplete = (id: string) => {
    const loan = loanRepayments.find(loan => loan.id === id);
    if (!loan) return;

    // Calculate next due date based on frequency
    let nextDueDate = new Date(loan.nextDueDate);
    switch (loan.frequency) {
      case 'monthly':
        nextDueDate = addMonths(nextDueDate, 1);
        break;
      case 'quarterly':
        nextDueDate = addMonths(nextDueDate, 3);
        break;
      case 'half-yearly':
        nextDueDate = addMonths(nextDueDate, 6);
        break;
      case 'annually':
        nextDueDate = addYears(nextDueDate, 1);
        break;
    }

    const updatedLoan = { ...loan, nextDueDate };
    const updatedLoans = loanRepayments.map(item => 
      item.id === id ? updatedLoan : item
    );
    
    setLoanRepayments(updatedLoans);
    localStorage.setItem('loanRepayments', JSON.stringify(updatedLoans));
  };

  // Vehicle renewal functions
  const addVehicleRenewal = (vehicle: Omit<VehicleRenewal, 'id'>) => {
    const newVehicle: VehicleRenewal = {
      ...vehicle,
      id: `vehicle-${Date.now()}`
    };
    
    const updatedVehicles = [...vehicleRenewals, newVehicle];
    setVehicleRenewals(updatedVehicles);
    localStorage.setItem('vehicleRenewals', JSON.stringify(updatedVehicles));
  };

  const updateVehicleRenewal = (vehicle: VehicleRenewal) => {
    const updatedVehicles = vehicleRenewals.map(item => 
      item.id === vehicle.id ? vehicle : item
    );
    setVehicleRenewals(updatedVehicles);
    localStorage.setItem('vehicleRenewals', JSON.stringify(updatedVehicles));
  };

  const removeVehicleRenewal = (id: string) => {
    const updatedVehicles = vehicleRenewals.filter(vehicle => vehicle.id !== id);
    setVehicleRenewals(updatedVehicles);
    localStorage.setItem('vehicleRenewals', JSON.stringify(updatedVehicles));
  };

  const markVehicleRenewalComplete = (id: string) => {
    const vehicle = vehicleRenewals.find(v => v.id === id);
    if (!vehicle) return;

    // Set last renewal date to current date and calculate next renewal date (1 year later)
    const lastRenewalDate = new Date();
    const nextRenewalDate = addYears(lastRenewalDate, 1);

    const updatedVehicle = { 
      ...vehicle, 
      lastRenewalDate,
      nextRenewalDate,
      status: 'pending' as const
    };
    
    const updatedVehicles = vehicleRenewals.map(item => 
      item.id === id ? updatedVehicle : item
    );
    
    setVehicleRenewals(updatedVehicles);
    localStorage.setItem('vehicleRenewals', JSON.stringify(updatedVehicles));
  };

  return (
    <ComplianceContext.Provider value={{ 
      complianceItems, 
      loanRepayments,
      vehicleRenewals,
      markCompleted,
      markPending,
      upcomingDeadlines,
      addLoanRepayment,
      updateLoanRepayment,
      removeLoanRepayment,
      markLoanRepaymentComplete,
      addVehicleRenewal,
      updateVehicleRenewal,
      removeVehicleRenewal,
      markVehicleRenewalComplete
    }}>
      {children}
    </ComplianceContext.Provider>
  );
};
