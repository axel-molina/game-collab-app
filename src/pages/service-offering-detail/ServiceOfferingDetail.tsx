import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useServiceOffering,
  useDeleteServiceOffering,
} from "@/hooks/useServiceOfferings";
import { useCreateServiceCollaborationRequest } from "@/hooks/useServiceOfferingRequests";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, Trash2, Send, Handshake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/shared/SEO";
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

export default function ServiceOfferingDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: service, isLoading, error } = useServiceOffering(id!);
  const deleteService = useDeleteServiceOffering();
  const createRequest = useCreateServiceCollaborationRequest();

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-8 flex flex-col gap-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("services.not_found", "Service not found")}
          </h2>
          <Button asChild>
            <Link to="/services">
              {t("common.back_to_services", "Back to Services")}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isOwner = user?.id === service.user_id;

  const handleDelete = async () => {
    await deleteService.mutateAsync(service.id);
    navigate("/services");
  };

  const handleCollaborationRequest = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    await createRequest.mutateAsync({
      serviceOfferingId: service.id,
      requesterId: user.id,
      ownerId: service.user_id,
    });
  };

  return (
    <Layout>
      <SEO
        title={service.title}
        description={service.description}
        url={`/services/${service.id}`}
        type="article"
      />
      <div className="container max-w-4xl py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back", "Back")}
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                {service.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {service.specialty}
                </span>
                <span className="text-sm">
                  {new Date(service.created_at).toLocaleDateString()}
                </span>
              </div>

              {service.image_url && (
                <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6 border bg-muted/30">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("services.about", "About this service")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-lg leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("services.provider", "Service Provider")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  to={`/users/${service.profiles?.username}`}
                  className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={service.profiles?.avatar_url || ""} />
                    <AvatarFallback className="text-lg">
                      {service.profiles?.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {service.profiles?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("services.view_profile", "View profile")}
                    </p>
                  </div>
                </Link>
              </CardContent>
              {!isOwner && (
                <CardFooter className="flex flex-col gap-3 pt-0">
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleCollaborationRequest}
                    disabled={createRequest.isPending}
                  >
                    <Handshake className="h-4 w-4" />
                    {t("services.want_to_collaborate", "I want to collaborate")}
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("services.contact_info", "Contact Info")}
                </CardTitle>
                <CardDescription>
                  {t("services.contact_desc", "How to reach out")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="break-all">{service.contact}</p>
              </CardContent>
            </Card>

            {isOwner && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    {t("common.danger_zone", "Danger Zone")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("services.delete", "Delete Service")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("common.are_you_sure", "Are you absolutely sure?")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t(
                            "services.delete_confirm",
                            "This action cannot be undone. This will permanently delete your service offering.",
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("common.cancel", "Cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t("services.delete", "Delete Service")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
