import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail } from "lucide-react";

interface ProfileInfoProps {
  profile: any;
  user: any;
}

export function ProfileInfo({ profile, user }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Nombre de usuario</p>
            <p className="text-lg font-semibold">
              {profile?.username || "Sin nombre"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Correo electrónico</p>
            <p className="text-lg font-semibold">
              {profile?.email || user.email || "Sin email"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
