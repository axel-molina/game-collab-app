import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENGINES, POSITIONS } from "@/lib/constants";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  search: string;
  engine: string;
  position: string;
  onSearchChange: (value: string) => void;
  onEngineChange: (value: string) => void;
  onPositionChange: (value: string) => void;
}

export function ProjectFilters({
  search,
  engine,
  position,
  onSearchChange,
  onEngineChange,
  onPositionChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar proyectos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Engine filter */}
      <Select value={engine} onValueChange={onEngineChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Motor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los motores</SelectItem>
          {ENGINES.map((eng) => (
            <SelectItem key={eng.value} value={eng.value}>
              {eng.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Position filter */}
      <Select value={position} onValueChange={onPositionChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Posición" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las posiciones</SelectItem>
          {POSITIONS.map((pos) => (
            <SelectItem key={pos.value} value={pos.value}>
              {pos.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
