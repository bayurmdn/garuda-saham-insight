
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Theme provider
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import SectorOverview from "./pages/SectorOverview";
import NotFound from "./pages/NotFound";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="garuda-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/screener" element={<Index />} />
              <Route path="/sectors" element={<SectorOverview />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
