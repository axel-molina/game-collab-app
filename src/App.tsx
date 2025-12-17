import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NewProject from "./pages/NewProject";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import NotFound from "./pages/NotFound";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
