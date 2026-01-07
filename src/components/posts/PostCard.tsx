import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProjectPost, extractTitleFromContent } from "@/hooks/useProjectPosts";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useTranslation } from "react-i18next";
import { PostMediaDisplay } from "./PostMediaDisplay";
import { usePostLikes } from "@/hooks/usePostLikes";
import { cn } from "@/lib/utils";
import { ShareProject } from "@/pages/project-detail/components/ShareProject";

interface PostCardProps {
  post: ProjectPost;
  commentCount?: number;
}

// Helper function to get simplified time format
const getSimplifiedTime = (date: Date, t: (key: string) => string): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}${t("common.unit_s")}`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}${t("common.unit_m")}`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}${t("common.unit_h")}`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}${t("common.unit_d")}`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)}${t("common.unit_w")}`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}${t("common.unit_mo")}`;
  return `${Math.floor(diffInSeconds / 31536000)}${t("common.unit_y")}`;
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

// Helper to check if content is long (more than 300 characters or 3 lines)
const isContentLong = (content: string): boolean => {
  return content.length > 300;
};

export function PostCard({ post, commentCount = 0 }: PostCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { count, userLiked, toggleLike, isAnimating, likesText } = usePostLikes(
    post.id
  );

  const title = extractTitleFromContent(post.content);

  // Remove title from content for display
  const contentWithoutTitle = post.content.replace(/^#\s+.+\n\n?/, "");
  const shouldShowMore = isContentLong(contentWithoutTitle);

  const engineLabel =
    post.projects?.engine === "other" && post.projects?.custom_engine
      ? post.projects.custom_engine
      : getEngineLabel(post.projects?.engine || "");

  const username = post.profiles?.username || t("common.anonymous");
  const timeAgo = getSimplifiedTime(new Date(post.created_at), t);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        {/* Header with user info */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/users/${username}`} onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage
                src={post.profiles?.avatar_url || undefined}
                alt={username}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getUserInitials(username)}
              </AvatarFallback>
            </Avatar>
          </Link>
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
              <span className="text-muted-foreground text-sm">{timeAgo}</span>
            </div>
            {post.projects && (
              <div className="flex items-center gap-2 mt-1">
                <Link to={`/projects/${post.project_id}`}>
                  <Badge
                    className={`${getEngineColor(
                      post.projects.engine
                    )} text-black dark:text-primary-foreground border-0 text-xs font-medium hover:opacity-80 transition-opacity`}
                  >
                    {post.projects.name}
                  </Badge>
                </Link>
                <Badge variant="outline" className="text-xs">
                  {engineLabel}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Media */}
        {post.post_media && post.post_media.length > 0 && (
          <PostMediaDisplay media={post.post_media} className="mb-4" />
        )}

        {/* Content with expand/collapse */}
        <div className="mb-4">
          <div
            className={`prose prose-neutral dark:prose-invert max-w-none ${
              !isExpanded && shouldShowMore ? "line-clamp-3" : ""
            }`}
          >
            <MarkdownRenderer content={contentWithoutTitle} />
          </div>

          {shouldShowMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-primary hover:text-black dark:hover:text-black h-auto font-semibold"
            >
              {isExpanded ? (
                <>
                  {t("common.see_less")}
                  <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  {t("common.see_more")}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Footer with actions */}
        <div className="flex flex-col gap-3 pt-3 border-t">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                toggleLike({
                  postUserId: post.user_id,
                  isCurrentlyLiked: userLiked,
                })
              }
              className={cn(
                "flex items-center gap-2 text-sm transition-all active:scale-95",
                userLiked
                  ? "text-red-500 font-medium"
                  : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-transform",
                  userLiked && "fill-current",
                  isAnimating && "animate-bounce scale-125"
                )}
              />
              <span>{count > 0 ? count : ""}</span>
            </button>

            <Link
              to={`/posts/${post.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{commentCount > 0 ? commentCount : ""}</span>
            </Link>

            <div className="ml-auto">
              <ShareProject
                url={`${window.location.origin}/posts/${post.id}`}
                projectName={title}
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only font-semibold">
                    {t("projects.share")}
                  </span>
                </Button>
              </ShareProject>
            </div>
          </div>

          {likesText && (
            <p className="text-xs text-muted-foreground animate-in fade-in slide-in-from-left-1 duration-300">
              {likesText}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
