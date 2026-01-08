import { useTranslation } from "react-i18next";
import { useCollaborationRequests } from "@/hooks/useProjectCollaboration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface CollaborationsTabProps {
  userId: string;
}

export function CollaborationsTab({ userId }: CollaborationsTabProps) {
  const { t, i18n } = useTranslation();
  const { requests, isLoading, respondToRequest, isResponding } =
    useCollaborationRequests(userId);
  const locale = i18n.language === "es" ? es : enUS;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center opacity-50">
          <User className="mb-4 h-12 w-12" />
          <p>{t("notifications.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-amber-500 border-amber-500 bg-amber-500/10"
          >
            {t("projects.request_pending")}
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="text-green-500 border-green-500 bg-green-500/10"
          >
            {t("projects.request_accepted")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="text-destructive border-destructive bg-destructive/10"
          >
            {t("projects.request_rejected")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary">
            {t("projects.request_cancelled") || "Cancelada"}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {t("projects.collaboration_requests")}
      </h2>
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {request.profiles?.username}
                </CardTitle>
                {getStatusBadge(request.status)}
              </div>
              <CardDescription>
                {t("projects.looking_for")} {request.projects?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(request.created_at), {
                    addSuffix: true,
                    locale: locale,
                  })}
                </span>

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="gap-1 bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        respondToRequest({
                          requestId: request.id,
                          status: "accepted",
                        })
                      }
                      disabled={isResponding}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t("projects.accept")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() =>
                        respondToRequest({
                          requestId: request.id,
                          status: "rejected",
                        })
                      }
                      disabled={isResponding}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("projects.reject")}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
