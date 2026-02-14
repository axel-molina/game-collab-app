import { useState, useEffect } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Plus } from "lucide-react";
import { FollowingProjectsTab } from "@/components/profile/FollowingProjectsTab";
import { UserPostsTab } from "@/components/profile/UserPostsTab";
import { UserProjectsTab } from "@/components/profile/UserProjectsTab";
import { CollaborationsTab } from "@/components/profile/CollaborationsTab";
import { NotificationSettings } from "./components/NotificationSettings";

import { useNavigate } from "react-router-dom";
import { ProfileCard } from "./components/ProfileCard";
import { NavigationMenu } from "./components/NavigationMenu";
import { ProfileInfo } from "./components/ProfileInfo";
import LoaderLayout from "./components/LoaderLayout";
import SignOutButton from "./components/SignOutButton";
import HeaderNewProjectsProfile from "./components/HeaderNewProjectsProfile";
import HeaderNewPostProfile from "./components/HeaderNewPostProfile";
import { AchievementsSection } from "@/components/profile/AchievementsSection";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const [searchParams] = useSearchParams();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "projects"
    | "posts"
    | "saved"
    | "collaborations"
    | "achievements"
    | "settings"
  >("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "collaborations") {
      setActiveTab("collaborations");
    } else if (tab === "projects") {
      setActiveTab("projects");
    } else if (tab === "posts") {
      setActiveTab("posts");
    } else if (tab === "saved") {
      setActiveTab("saved");
    } else if (tab === "achievements") {
      setActiveTab("achievements");
    } else if (tab === "settings") {
      setActiveTab("settings");
    } else if (tab === "profile") {
      setActiveTab("profile");
    }
  }, [searchParams]);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (authLoading || profileLoading) {
    return <LoaderLayout />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Get initials from username or email
  const getInitials = () => {
    const nameToUse = profile?.username || user.email || "";
    if (nameToUse) {
      return nameToUse
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  return (
    <Layout>
      <div className="container max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            <ProfileCard
              profile={profile}
              user={user}
              getInitials={getInitials}
            />
            <NavigationMenu activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Sign Out Button */}
            <SignOutButton
              handleSignOut={handleSignOut}
              isSigningOut={isSigningOut}
            />
          </aside>

          {/* Main Content */}
          <div className="min-h-[600px]">
            {activeTab === "profile" && (
              <ProfileInfo profile={profile} user={user} />
            )}

            {activeTab === "projects" && <HeaderNewProjectsProfile />}

            {activeTab === "posts" && <HeaderNewPostProfile />}

            {activeTab === "saved" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  {t("common.saved_projects")}
                </h2>
                <FollowingProjectsTab userId={user.id} />
              </div>
            )}

            {activeTab === "collaborations" && (
              <CollaborationsTab userId={user.id} />
            )}

            {activeTab === "achievements" && (
              <AchievementsSection userId={user.id} isOwnProfile={true} />
            )}

            {activeTab === "settings" && (
              <NotificationSettings userId={user.id} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
