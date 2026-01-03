import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

interface FilterTabsProps {
  filter: "all" | "following";
  onFilterChange: (filter: "all" | "following") => void;
}

export function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs
      value={filter}
      onValueChange={(v) => onFilterChange(v as "all" | "following")}
      className="mb-6"
    >
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="all">{t("news.all")}</TabsTrigger>
        <TabsTrigger value="following">{t("news.following")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
