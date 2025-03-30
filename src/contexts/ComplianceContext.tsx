
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBusinessContext } from './BusinessContext';
import { addMonths, addDays, format, isAfter, isBefore, endOfDay } from 'date-fns';

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

interface ComplianceContextType {
  complianceItems: ComplianceItem[];
  markCompleted: (id: string) => void;
  markPending: (id: string) => void;
  upcomingDeadlines: ComplianceItem[];
}

const ComplianceContext = createContext<ComplianceContextType>({
  complianceItems: [],
  markCompleted: () => {},
  markPending: () => {},
  upcomingDeadlines: [],
});

export const useComplianceContext = () => useContext(ComplianceContext);

export const ComplianceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { businessInfo } = useBusinessContext();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<ComplianceItem[]>([]);

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

    // Update upcoming deadlines
    const upcoming = items
      .filter(item => item.status !== 'completed' && isBefore(today, item.dueDate))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5);
    
    setUpcomingDeadlines(upcoming);
    
  }, [businessInfo]);

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

  return (
    <ComplianceContext.Provider value={{ 
      complianceItems, 
      markCompleted,
      markPending,
      upcomingDeadlines
    }}>
      {children}
    </ComplianceContext.Provider>
  );
};
