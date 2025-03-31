
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ComplianceProvider } from "@/contexts/ComplianceContext";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Checklist from "./pages/Checklist";
import Calendar from "./pages/Calendar";
import Reminders from "./pages/Reminders";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BusinessProvider>
        <ComplianceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/services" element={<Services />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ComplianceProvider>
      </BusinessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
