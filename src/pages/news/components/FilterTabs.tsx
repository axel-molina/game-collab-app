import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  filter: "all" | "following";
  onFilterChange: (filter: "all" | "following") => void;
}

export function FilterTabs({ filter, onFilterChange }: FilterTabsProps) {
  return (
    <Tabs
      value={filter}
      onValueChange={(v) => onFilterChange(v as "all" | "following")}
      className="mb-6"
    >
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="following">Seguidos</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
