import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useCollaborationRequests } from "@/hooks/useProjectCollaboration";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(user?.id);
  const { requests, respondToRequest, isResponding } = useCollaborationRequests(
    user?.id
  );
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language === "es" ? es : enUS;

  const handleNotificationClick = async (notification: Notification) => {
    // Navigate to entity if applicable
    if (notification.entity_type === "project" && notification.entity_id) {
      navigate(`/projects/${notification.entity_id}`);
    } else if (notification.entity_type === "post" && notification.entity_id) {
      navigate(`/posts/${notification.entity_id}`);
    } else if (
      notification.entity_type === "profile" &&
      notification.entity_id
    ) {
      navigate(`/profile/${notification.entity_id}`);
    } else if (
      notification.type === "collaboration_request" ||
      notification.type === "collaboration_response"
    ) {
      // Find the request to get more details (project_id or requester username)
      let request = requests.find((r) => r.id === notification.entity_id);

      if (!request && notification.entity_id) {
        const { data } = await supabase
          .from("project_collaboration_requests")
          .select("*, profiles:requester_id(username)")
          .eq("id", notification.entity_id)
          .maybeSingle();
        request = data;
      }

      if (request) {
        if (notification.type === "collaboration_request") {
          // As requested: always lead to the requester's profile
          if (request.profiles?.username) {
            navigate(`/users/${request.profiles.username}`);
          }
        } else if (notification.type === "collaboration_response") {
          // Lead to the project where the contact info is revealed
          navigate(`/projects/${request.project_id}`);
        }
      }
    }

    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 px-4">
          <DropdownMenuLabel className="p-0 font-bold">
            {t("notifications.title", "Notificaciones")}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
              onClick={() => markAllAsRead()}
            >
              {t("notifications.mark_all_read", "Marcar todas como leídas")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
              <Bell className="mb-2 h-10 w-10" />
              <p className="text-sm">
                {t("notifications.empty", "No tienes notificaciones")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => {
                const request = requests.find((r) => r.id === n.entity_id);
                const isPending =
                  n.type === "collaboration_request" &&
                  request?.status === "pending";

                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={cn(
                      "flex flex-col gap-1 border-b border-border/50 p-4 text-left transition-colors hover:bg-muted/50 last:border-0",
                      !n.is_read && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          !n.is_read && "text-primary"
                        )}
                      >
                        {n.title}
                      </span>
                      {!n.is_read && (
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {n.message && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {n.message}
                      </p>
                    )}

                    {isPending && (
                      <div
                        className="mt-2 flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          className="h-8 gap-1 bg-green-600 hover:bg-green-700 text-[11px]"
                          onClick={() => {
                            respondToRequest({
                              requestId: n.entity_id!,
                              status: "accepted",
                            });
                            markAsRead(n.id);
                          }}
                          disabled={isResponding}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {t("projects.accept")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 border-destructive text-destructive hover:bg-destructive/10 text-[11px]"
                          onClick={() => {
                            respondToRequest({
                              requestId: n.entity_id!,
                              status: "rejected",
                            });
                            markAsRead(n.id);
                          }}
                          disabled={isResponding}
                        >
                          <XCircle className="h-3 w-3" />
                          {t("projects.reject")}
                        </Button>
                      </div>
                    )}

                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                        locale: locale,
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
