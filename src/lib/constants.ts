export const ENGINES = [
  { value: "unity", label: "Unity" },
  { value: "godot", label: "Godot" },
  { value: "gamemaker", label: "Game Maker" },
  { value: "unreal", label: "Unreal Engine" },
  { value: "rpgmaker", label: "RPG Maker" },
  { value: "creative-engine", label: "Creative Engine" },
  { value: "other", label: "Otro" },
] as const;

export const POSITIONS = [
  { value: "programmer", label: "Programador" },
  { value: "2d-designer", label: "Diseñador 2D" },
  { value: "3d-designer", label: "Diseñador 3D" },
  { value: "animator", label: "Animador" },
  { value: "pixel-artist", label: "Pixel Artist" },
  { value: "musician", label: "Músico" },
  { value: "sound-designer", label: "Diseñador de sonido / FX" },
  { value: "game-designer", label: "Game Designer" },
  { value: "ui-ux", label: "UI / UX Designer" },
  { value: "qa-tester", label: "QA / Tester" },
  { value: "narrative-designer", label: "Narrative Designer" },
  { value: "technical-artist", label: "Technical Artist" },
  { value: "producer", label: "Producer" },
] as const;

export type Engine = typeof ENGINES[number]["value"];
export type Position = typeof POSITIONS[number]["value"];

export function getEngineLabel(value: string): string {
  const engine = ENGINES.find((e) => e.value === value);
  return engine?.label || value;
}

export function getPositionLabel(value: string): string {
  const position = POSITIONS.find((p) => p.value === value);
  return position?.label || value;
}

export function getEngineColor(engine: string): string {
  const colors: Record<string, string> = {
    unity: "bg-engine-unity",
    godot: "bg-engine-godot",
    gamemaker: "bg-engine-gamemaker",
    unreal: "bg-engine-unreal",
    rpgmaker: "bg-engine-rpgmaker",
    "creative-engine": "bg-engine-creative-engine",
    other: "bg-engine-other",
  };
  return colors[engine] || colors.other;
}
