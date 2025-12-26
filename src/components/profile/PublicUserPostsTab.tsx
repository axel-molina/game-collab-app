import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUserPosts,
  extractTitleFromContent,
  extractExcerptFromContent,
} from "@/hooks/useProjectPosts";
import { getEngineLabel, getEngineColor } from "@/lib/constants";
import { Calendar, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PublicUserPostsTabProps {
  userId: string;
}

export function PublicUserPostsTab({ userId }: PublicUserPostsTabProps) {
  const { data: posts, isLoading } = useUserPosts(userId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay posts</h3>
        <p className="text-muted-foreground">
          Este usuario aún no ha creado ningún post
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const title = extractTitleFromContent(post.content);
        const excerpt = extractExcerptFromContent(post.content, 100);
        const engineLabel =
          post.projects?.engine === "other" && post.projects?.custom_engine
            ? post.projects.custom_engine
            : getEngineLabel(post.projects?.engine || "");

        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <Link to={`/posts/${post.id}`}>
                <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-1">
                  {title}
                </CardTitle>
              </Link>
              {post.projects && (
                <div className="flex items-center gap-2 mt-2">
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
            </CardHeader>
            <CardContent>
              <Link to={`/posts/${post.id}`}>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {excerpt}
                </p>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
