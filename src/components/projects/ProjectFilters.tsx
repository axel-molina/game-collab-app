import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("home.filters.search")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Engine filter */}
      <Select value={engine} onValueChange={onEngineChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder={t("home.filters.engine")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("home.filters.engine")}</SelectItem>
          {ENGINES.map((eng) => (
            <SelectItem key={eng.value} value={eng.value}>
              {t(`engines.${eng.value}`, eng.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Position filter */}
      <Select value={position} onValueChange={onPositionChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder={t("home.filters.position")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("home.filters.position")}</SelectItem>
          {POSITIONS.map((pos) => (
            <SelectItem key={pos.value} value={pos.value}>
              {t(`positions.${pos.value}`, pos.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
