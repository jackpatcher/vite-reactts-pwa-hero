import { useMemo } from "react";
import { useTheme } from "../modules/storage/hooks";

// Theme palette mapping
const PALETTE_COLORS: Record<string, string> = {
  ocean: "#2563eb",
  mint: "#0f766e",
  sunset: "#f97316",
  violet: "#7c3aed",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  indigo: "#4f46e5",
  slate: "#334155",
  lime: "#65a30d",
  coral: "#fb7185",
  plum: "#9333ea",
};

/**
 * Convert hex color to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Hook to get current theme color
 * Returns the hex color code of the current palette
 */
export function useThemeColor(): string {
  const theme = useTheme();

  return useMemo(() => {
    const paletteId = theme?.paletteId;
    const color = PALETTE_COLORS[paletteId as string] || PALETTE_COLORS["ocean"] || "#2563eb";
    return color;
  }, [theme?.paletteId, theme]);
}

/**
 * Get theme color with specified alpha
 */
export function useThemeColorRgba(alpha: number = 0.15): string {
  const color = useThemeColor();
  return useMemo(() => hexToRgba(color, alpha), [color, alpha]);
}

/**
 * Get color map for all palettes
 */
export function getPaletteColor(paletteId?: string): string {
  return PALETTE_COLORS[paletteId ?? "ocean"] || "#2563eb";
}
