
import React from 'react';
import { Link } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckIcon, FileTextIcon, ClockIcon, LinkIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { businessInfo, isOnboardingComplete } = useBusinessContext();

  if (!isOnboardingComplete) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <CheckIcon className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-semibold text-gray-900">ComplianceTracker Nepal</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            <Button variant="ghost" asChild>
              <Link to="/dashboard" className="flex items-center">
                <FileTextIcon className="h-4 w-4 mr-2" />
                <span>Dashboard</span>
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link to="/checklist" className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-2" />
                <span>Checklist</span>
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link to="/calendar" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Calendar</span>
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link to="/reminders" className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>Reminders</span>
              </Link>
            </Button>
            
            <Button variant="ghost" asChild>
              <Link to="/services" className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                <span>Services</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4 hidden md:inline-block">
              {businessInfo.name}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
