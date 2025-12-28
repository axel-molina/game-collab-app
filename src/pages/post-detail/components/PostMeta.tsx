import { Link } from "react-router-dom";
import { User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface PostMetaProps {
  post: any;
}

export function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
      <div className="flex items-center gap-1">
        <User className="h-4 w-4" />
        <Link
          to={`/users/${post.profiles?.username}`}
          className="hover:text-primary hover:underline"
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
    </div>
  );
}
