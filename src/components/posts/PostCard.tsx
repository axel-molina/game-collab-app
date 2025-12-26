import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ProjectPost,
  extractTitleFromContent,
  extractExcerptFromContent,
} from "@/hooks/useProjectPosts";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PostCardProps {
  post: ProjectPost;
  commentCount?: number;
}

// Helper function to get simplified time format
const getSimplifiedTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}sem`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}mes`;
  return `${Math.floor(diffInSeconds / 31536000)}a`;
};

// Helper to get user initials
const getUserInitials = (username: string): string => {
  return username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function PostCard({ post, commentCount = 0 }: PostCardProps) {
  const title = extractTitleFromContent(post.content);
  const excerpt = extractExcerptFromContent(post.content);

  const engineLabel =
    post.projects?.engine === "other" && post.projects?.custom_engine
      ? post.projects.custom_engine
      : getEngineLabel(post.projects?.engine || "");

  const username = post.profiles?.username || "Anónimo";
  const timeAgo = getSimplifiedTime(new Date(post.created_at));

  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in h-full">
        <CardContent className="p-6">
          <div className="flex flex-col h-full w-full">
            {/* Header with user info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.profiles?.avatar_url || undefined}
                  alt={username}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getUserInitials(username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to={`/users/${username}`}
                    className="font-semibold hover:text-primary hover:underline text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {username}
                  </Link>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-muted-foreground text-sm">
                    {timeAgo}
                  </span>
                </div>
                {post.projects && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`${getEngineColor(
                        post.projects.engine
                      )} text-black dark:text-primary-foreground border-0 text-xs font-medium`}
                    >
                      {post.projects.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {engineLabel}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
              {excerpt}
            </p>

            {/* Footer with comment count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t">
              <MessageSquare className="h-4 w-4" />
              <span>
                {commentCount} comentario{commentCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
