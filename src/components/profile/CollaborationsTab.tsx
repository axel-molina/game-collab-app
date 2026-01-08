import { useTranslation } from "react-i18next";
import {
  useCollaborationRequests,
  useMyCollaborations,
} from "@/hooks/useProjectCollaboration";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Mail,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useSearchParams } from "react-router-dom";

interface CollaborationsTabProps {
  userId: string;
}

export function CollaborationsTab({ userId }: CollaborationsTabProps) {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get("subtab") === "sent" ? "sent" : "received";
  const {
    requests: receivedRequests,
    isLoading: loadingReceived,
    respondToRequest,
    isResponding,
  } = useCollaborationRequests(userId);
  const { data: sentRequests = [], isLoading: loadingSent } =
    useMyCollaborations(userId);

  const locale = i18n.language === "es" ? es : enUS;

  if (loadingReceived || loadingSent) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t("projects.collaboration_requests")}
        </h2>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="received">
            {t("projects.requests_received") || "Recibidas"}
            {receivedRequests.filter((r) => r.status === "pending").length >
              0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-[10px]">
                {receivedRequests.filter((r) => r.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">
            {t("projects.my_applications") || "Mis Solicitudes"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                <User className="mb-4 h-12 w-12" />
                <p>{t("notifications.empty")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {receivedRequests.map((request) => (
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
                            className="gap-1 bg-green-600 hover:bg-green-700 font-semibold"
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
                            className="gap-1 border-destructive text-destructive hover:bg-destructive/10 font-semibold"
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
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                <Mail className="mb-4 h-12 w-12" />
                <p>{t("notifications.empty")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sentRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {request.projects?.name}
                      </CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <CardDescription>
                      <Link
                        to={`/projects/${request.project_id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {t("projects.view_project") || "Ver proyecto"}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {request.status === "accepted" &&
                        request.projects?.contact && (
                          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                              {t("projects.contact_info") ||
                                "Información de contacto"}
                            </p>
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <span className="text-sm break-all font-medium">
                                {request.projects.contact}
                              </span>
                            </div>
                          </div>
                        )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t("projects.sent") || "Enviada"}{" "}
                          {formatDistanceToNow(new Date(request.created_at), {
                            addSuffix: true,
                            locale: locale,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
