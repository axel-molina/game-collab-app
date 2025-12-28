import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserPostsTab } from "@/components/profile/UserPostsTab";
import { useAuth } from "@/hooks/useAuth";

const HeaderNewPostProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Posts</h2>
        <Button asChild>
          <Link to="/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Post
          </Link>
        </Button>
      </div>
      <UserPostsTab userId={user.id} />
    </div>
  );
};

export default HeaderNewPostProfile;
