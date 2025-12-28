import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileCardProps {
  profile: any;
  getInitials: () => string;
}

export function UserProfileCard({
  profile,
  getInitials,
}: UserProfileCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={profile.avatar_url || undefined}
              alt={profile.username}
            />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center w-full">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {profile.email}
            </p>
          </div>

          {profile.created_at && (
            <div className="text-xs text-muted-foreground text-center pt-2 border-t w-full">
              Miembro desde{" "}
              {new Date(profile.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
