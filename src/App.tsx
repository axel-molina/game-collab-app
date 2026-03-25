import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/index/Index";
import Auth from "./pages/auth/Auth";
import ResetPassword from "./pages/auth/ResetPassword";
import News from "./pages/news/News";
import About from "./pages/about/About";
import Profile from "./pages/profile/Profile";
import UserProfile from "./pages/user-profile/UserProfile";
import NewProject from "./pages/new-project/NewProject";
import ProjectDetail from "./pages/project-detail/ProjectDetail";
import EditProject from "./pages/edit-project/EditProject";
import CreatePost from "./pages/create-post/CreatePost";
import PostDetail from "./pages/post-detail/PostDetail";
import EditPost from "./pages/edit-post/EditPost";
import FollowingProjects from "./pages/following-projects/FollowingProjects";
import Feedback from "./pages/feedback/Feedback";
import NotFound from "./pages/not-found/NotFound";
import ServiceOfferings from "./pages/service-offerings/ServiceOfferings";
import NewServiceOffering from "./pages/new-service-offering/NewServiceOffering";
import ServiceOfferingDetail from "./pages/service-offering-detail/ServiceOfferingDetail";

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<News />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/projects" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:username" element={<UserProfile />} />
        <Route path="/projects/new" element={<NewProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="/posts/new" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="/following" element={<FollowingProjects />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/services" element={<ServiceOfferings />} />
        <Route path="/services/new" element={<NewServiceOffering />} />
        <Route path="/services/:id" element={<ServiceOfferingDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
