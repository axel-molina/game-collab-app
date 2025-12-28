import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectPositionsProps {
  positions: Array<{ id: string; position: string; is_custom: boolean }>;
  getPositionLabel: (position: string) => string;
}

export function ProjectPositions({
  positions,
  getPositionLabel,
}: ProjectPositionsProps) {
  if (positions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Se busca</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => (
            <Badge key={pos.id} variant="secondary">
              {pos.is_custom ? pos.position : getPositionLabel(pos.position)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
