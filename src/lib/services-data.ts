
export interface ServiceCategory {
  id: number;
  name: string;
  services: Service[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price?: string;
  contactInfo?: string;
  url?: string;
}

// This is simulated data from ubs.com.np
export const serviceCategories: ServiceCategory[] = [
  {
    id: 1,
    name: "Business Registration",
    services: [
      {
        id: 101,
        title: "Company Registration",
        description: "Complete company registration service including PAN registration and other statutory requirements.",
        price: "NPR 15,000 - 25,000",
        contactInfo: "+977-1-4102350",
        url: "https://ubs.com.np/services/company-registration"
      },
      {
        id: 102,
        title: "Sole Proprietorship Registration",
        description: "Register your individual business with all necessary government departments.",
        price: "NPR 8,000 - 12,000",
        contactInfo: "+977-1-4102350",
        url: "https://ubs.com.np/services/sole-proprietorship"
      },
      {
        id: 103,
        title: "Partnership Firm Registration",
        description: "Complete partnership registration including partnership deed preparation.",
        price: "NPR 12,000 - 18,000",
        contactInfo: "+977-1-4102350",
        url: "https://ubs.com.np/services/partnership-registration"
      }
    ]
  },
  {
    id: 2,
    name: "Tax & Compliance",
    services: [
      {
        id: 201,
        title: "VAT Registration",
        description: "Complete VAT registration service with IRD Nepal.",
        price: "NPR 5,000 - 8,000",
        contactInfo: "+977-1-4102351",
        url: "https://ubs.com.np/services/vat-registration"
      },
      {
        id: 202,
        title: "Annual Tax Filing",
        description: "Preparation and submission of annual tax returns for businesses.",
        price: "NPR 5,000 - 25,000",
        contactInfo: "+977-1-4102351",
        url: "https://ubs.com.np/services/annual-tax-filing"
      },
      {
        id: 203,
        title: "Tax Audit",
        description: "Comprehensive tax audit services for businesses of all sizes.",
        price: "NPR 15,000 - 50,000",
        contactInfo: "+977-1-4102351",
        url: "https://ubs.com.np/services/tax-audit"
      }
    ]
  },
  {
    id: 3,
    name: "Accounting Services",
    services: [
      {
        id: 301,
        title: "Bookkeeping",
        description: "Regular bookkeeping and accounting services for businesses.",
        price: "NPR 5,000 - 15,000 per month",
        contactInfo: "+977-1-4102352",
        url: "https://ubs.com.np/services/bookkeeping"
      },
      {
        id: 302,
        title: "Financial Statement Preparation",
        description: "Preparation of balance sheets, income statements, and cash flow statements.",
        price: "NPR 10,000 - 30,000",
        contactInfo: "+977-1-4102352",
        url: "https://ubs.com.np/services/financial-statements"
      }
    ]
  },
  {
    id: 4,
    name: "Legal Services",
    services: [
      {
        id: 401,
        title: "Contract Drafting",
        description: "Drafting and review of various business contracts and agreements.",
        price: "NPR 8,000 - 25,000",
        contactInfo: "+977-1-4102353",
        url: "https://ubs.com.np/services/contract-drafting"
      },
      {
        id: 402,
        title: "Legal Consultation",
        description: "Legal advisory services for businesses on various matters.",
        price: "NPR 2,500 - 5,000 per hour",
        contactInfo: "+977-1-4102353",
        url: "https://ubs.com.np/services/legal-consultation"
      }
    ]
  }
];
