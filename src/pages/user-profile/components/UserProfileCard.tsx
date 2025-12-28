import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlignLeft, Briefcase, Cpu } from "lucide-react";

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
      <CardContent className="pt-6 space-y-6">
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
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <AlignLeft className="h-3 w-3" />
              Biografía
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Roles */}
        {profile.roles && profile.roles.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Briefcase className="h-3 w-3" />
              Roles
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.roles.map((role: any) => (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="px-2 py-0 text-[10px]"
                >
                  {role.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        {profile.technologies && profile.technologies.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <Cpu className="h-3 w-3" />
              Tecnologías
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.technologies.map((tech: any) => (
                <Badge
                  key={tech.id}
                  variant="outline"
                  className="px-2 py-0 text-[10px]"
                >
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {profile.created_at && (
          <div className="text-[10px] text-muted-foreground text-center pt-4 border-t w-full">
            Miembro desde{" "}
            {new Date(profile.created_at).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
