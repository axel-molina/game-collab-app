/**
 * Colores principales de GameCollab
 * Estos colores se utilizan en toda la aplicación y se adaptan al tema (light/dark)
 */

export const Colors = {
  // Color azul para "Game"
  gameBlue: "#67C2E7",
  // Color verde para "Collab"
  collabGreen: "#AFD275",
} as const;

/**
 * Obtiene el color según el tema actual
 * Por ahora los colores son los mismos en ambos temas, pero se puede extender
 */
export function getThemeColor(
  color: keyof typeof Colors,
  theme: "light" | "dark" = "light"
): string {
  return Colors[color];
}

