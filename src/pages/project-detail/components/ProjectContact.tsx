import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

interface ProjectContactProps {
  contact: string;
}

export function ProjectContact({ contact }: ProjectContactProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
          <span className="break-all">{contact}</span>
        </div>
      </CardContent>
    </Card>
  );
}
