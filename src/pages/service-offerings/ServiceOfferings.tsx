import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useServiceOfferings } from "@/hooks/useServiceOfferings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Plus } from "lucide-react";
import { SEO } from "@/components/shared/SEO";
import { useAuth } from "@/hooks/useAuth";

export default function ServiceOfferings() {
  const { t } = useTranslation();
  const { data: offerings, isLoading } = useServiceOfferings();
  const { user } = useAuth();

  return (
    <Layout>
      <SEO
        title={t("services.title", "Service Offerings")}
        description={t(
          "services.description",
          "Find collaborators offering their services.",
        )}
      />
      <div className="container py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("services.title", "Service Offerings")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t(
                "services.subtitle",
                "Find talented people to collaborate on your projects.",
              )}
            </p>
          </div>
          {user && (
            <Button asChild>
              <Link to="/services/new" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("services.new", "Publish Service")}
              </Link>
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex flex-col h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex items-center gap-2 mt-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : offerings?.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t("services.empty_title", "No service offerings yet")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t(
                "services.empty_desc",
                "Be the first to offer your skills to the community!",
              )}
            </p>
            {user && (
              <Button asChild>
                <Link to="/services/new">
                  {t("services.new", "Publish Service")}
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings?.map((offering) => (
              <Link key={offering.id} to={`/services/${offering.id}`}>
                <Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    {offering.image_url ? (
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={offering.image_url}
                          alt={offering.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-muted/30 flex items-center justify-center rounded-t-lg">
                        <Briefcase className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="px-6 pt-6 flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl leading-tight line-clamp-2">
                          {offering.title}
                        </CardTitle>
                        <p className="text-sm font-medium text-primary mt-1">
                          {offering.specialty}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
                      {offering.description}
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={offering.profiles?.avatar_url || ""}
                        />
                        <AvatarFallback>
                          {offering.profiles?.username
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {offering.profiles?.username}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
