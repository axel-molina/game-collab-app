import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Heart,
  UserPlus,
  MessageSquare,
  Briefcase,
  Send,
  Share2,
} from "lucide-react";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationSettingsProps {
  userId: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const { t } = useTranslation();
  const { settings, isLoading, updateSettings } =
    useNotificationSettings(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("notifications.settings_title")}</CardTitle>
          <CardDescription>{t("notifications.settings_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const settingItems = [
    {
      id: "likes_enabled",
      label: t("notifications.settings.likes"),
      description: t("notifications.settings.likes_desc"),
      icon: Heart,
    },
    {
      id: "follows_enabled",
      label: t("notifications.settings.follows"),
      description: t("notifications.settings.follows_desc"),
      icon: UserPlus,
    },
    {
      id: "comments_enabled",
      label: t("notifications.settings.comments"),
      description: t("notifications.settings.comments_desc"),
      icon: MessageSquare,
    },
    {
      id: "project_requests_enabled",
      label: t("notifications.settings.project_requests"),
      description: t("notifications.settings.project_requests_desc"),
      icon: Briefcase,
    },
    {
      id: "collaboration_requests_enabled",
      label: t("notifications.settings.collaboration_requests"),
      description: t("notifications.settings.collaboration_requests_desc"),
      icon: Send,
    },
    {
      id: "collaboration_responses_enabled",
      label: t("notifications.settings.collaboration_responses"),
      description: t("notifications.settings.collaboration_responses_desc"),
      icon: Share2,
    },
    {
      id: "new_project_posts_enabled",
      label: t("notifications.settings.new_project_posts"),
      description: t("notifications.settings.new_project_posts_desc"),
      icon: Bell,
    },
  ];

  const handleToggle = (settingId: string, enabled: boolean) => {
    updateSettings({ [settingId]: enabled });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {t("notifications.settings_title")}
        </CardTitle>
        <CardDescription>{t("notifications.settings_desc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {settingItems.map((item) => {
          const Icon = item.icon;
          const isEnabled = settings ? (settings as any)[item.id] : true;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/50">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-0.5">
                  <Label
                    htmlFor={item.id}
                    className="text-sm font-semibold cursor-pointer"
                  >
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground leading-none">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                id={item.id}
                checked={isEnabled}
                onCheckedChange={(checked) => handleToggle(item.id, checked)}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
