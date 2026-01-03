import { Link } from "react-router-dom";
import { User, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface PostMetaProps {
  post: any;
}

export function PostMeta({ post }: PostMetaProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "es" ? es : enUS;

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
      <div className="flex items-center gap-1">
        <User className="h-4 w-4" />
        <Link
          to={`/users/${post.profiles?.username}`}
          className="hover:text-primary hover:underline"
        >
          {post.profiles?.username || t("common.anonymous")}
        </Link>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>
          {formatDistanceToNow(new Date(post.created_at), {
            addSuffix: true,
            locale: dateLocale,
          })}
        </span>
      </div>
    </div>
  );
}
