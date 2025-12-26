import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ProjectPost,
  extractTitleFromContent,
  extractExcerptFromContent,
} from "@/hooks/useProjectPosts";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { Calendar, User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PostCardProps {
  post: ProjectPost;
  commentCount?: number;
}

export function PostCard({ post, commentCount = 0 }: PostCardProps) {
  const title = extractTitleFromContent(post.content);
  const excerpt = extractExcerptFromContent(post.content);

  const engineLabel =
    post.projects?.engine === "other" && post.projects?.custom_engine
      ? post.projects.custom_engine
      : getEngineLabel(post.projects?.engine || "");

  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in h-full">
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            {/* Header with project badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {title}
                </h3>
                {post.projects && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={`${getEngineColor(
                        post.projects.engine
                      )} text-primary-foreground border-0 text-xs`}
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

            {/* Excerpt */}
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
              {excerpt}
            </p>

            {/* Meta information */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <Link
                  to={`/users/${post.profiles?.username}`}
                  className="hover:text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.profiles?.username || "Anónimo"}
                </Link>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <MessageSquare className="h-4 w-4" />
                <span>{commentCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
