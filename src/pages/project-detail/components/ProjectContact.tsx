import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Loader2, Send, XCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProjectCollaboration } from "@/hooks/useProjectCollaboration";

interface ProjectContactProps {
  contact: string;
  projectId: string;
  ownerId: string;
  isOwner: boolean;
}

export function ProjectContact({
  contact,
  projectId,
  ownerId,
  isOwner,
}: ProjectContactProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    request,
    isLoading,
    requestCollaboration,
    isRequesting,
    cancelRequest,
    isCancelling,
  } = useProjectCollaboration(projectId, user?.id);

  const showContact = isOwner || request?.status === "accepted";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("projects.contact")}</CardTitle>
      </CardHeader>
      <CardContent>
        {showContact ? (
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
            <span className="break-all">{contact}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {!user ? (
              <p className="text-sm text-muted-foreground italic">
                {t("auth.login_required")}
              </p>
            ) : (
              <>
                {(!request || request.status === "cancelled") && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => requestCollaboration(ownerId)}
                    disabled={isRequesting}
                  >
                    {isRequesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {t("projects.request_collaboration")}
                  </Button>
                )}

                {request?.status === "pending" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-500 text-sm font-medium">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("projects.request_pending")}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => cancelRequest(request.id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {t("projects.cancel_request")}
                    </Button>
                  </div>
                )}

                {request?.status === "rejected" && (
                  <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                    <XCircle className="h-4 w-4" />
                    {t("projects.request_rejected")}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
