import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  Heart,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { ShareProject } from "./ShareProject";

interface ProjectHeaderProps {
  project: any;
  engineLabel: string;
  getEngineColor: (engine: string) => string;
  isOwner: boolean;
  likesCount: number;
  userLiked: boolean;
  isToggling: boolean;
  toggleLike: () => void;
  isFollowing: boolean;
  toggleFollow: () => void;
  isFollowPending: boolean;
  handleDelete: () => void;
  deleteProjectPending: boolean;
}

export function ProjectHeader({
  project,
  engineLabel,
  getEngineColor,
  isOwner,
  likesCount,
  userLiked,
  isToggling,
  toggleLike,
  isFollowing,
  toggleFollow,
  isFollowPending,
  handleDelete,
  deleteProjectPending,
}: ProjectHeaderProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "es" ? es : enUS;

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Badge
            className={`${getEngineColor(
              project.engine
            )} text-primary-foreground border-0`}
          >
            {engineLabel}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <Link
              to={`/users/${project.profiles?.username}`}
              className="truncate max-w-[120px] hover:text-primary hover:underline transition-colors"
            >
              {project.profiles?.username || t("common.anonymous")}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(project.created_at), {
                addSuffix: true,
                locale: locale,
              })}
            </span>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            v{project.engine_version}
          </Badge>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Button
              variant={userLiked ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLike()}
              disabled={isToggling || isOwner}
              className="gap-2 h-9 px-3 sm:px-4"
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 ${userLiked ? "fill-current" : ""}`}
                />
              )}
              <span>{likesCount}</span>
            </Button>

            <Button
              variant={isFollowing ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFollow()}
              disabled={isFollowPending || isOwner}
              className="gap-2 h-9 px-3 sm:px-4"
              title={
                isFollowing
                  ? t("projects.remove_favorite")
                  : t("projects.add_favorite")
              }
            >
              {isFollowPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFollowing ? (
                <BookmarkCheck className="h-4 w-4 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <ShareProject projectName={project.name} />
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              {t("projects.edit")}
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t("projects.delete")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("projects.delete_title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("projects.delete_description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("posts.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteProjectPending}
                >
                  {deleteProjectPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {t("projects.delete_confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
