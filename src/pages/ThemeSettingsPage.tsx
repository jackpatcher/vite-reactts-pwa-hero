import { Button } from "@heroui/react";
import PageShell from "../components/PageShell";

type ThemePalette = {
  id: string;
  label: string;
  accent: string;
  accent2: string;
};

type ThemeFont = {
  id: string;
  label: string;
  value: string;
};

const themePalettes: ThemePalette[] = [
  { id: "ocean", label: "Ocean", accent: "#2563eb", accent2: "#0ea5e9" },
  { id: "mint", label: "Mint", accent: "#0f766e", accent2: "#22d3ee" },
  { id: "sunset", label: "Sunset", accent: "#f97316", accent2: "#f43f5e" },
  { id: "violet", label: "Violet", accent: "#7c3aed", accent2: "#ec4899" },
  { id: "emerald", label: "Emerald", accent: "#10b981", accent2: "#34d399" },
  { id: "amber", label: "Amber", accent: "#f59e0b", accent2: "#fbbf24" },
  { id: "rose", label: "Rose", accent: "#f43f5e", accent2: "#fb7185" },
  { id: "indigo", label: "Indigo", accent: "#4f46e5", accent2: "#818cf8" },
  { id: "slate", label: "Slate", accent: "#334155", accent2: "#64748b" },
  { id: "lime", label: "Lime", accent: "#65a30d", accent2: "#a3e635" },
  { id: "coral", label: "Coral", accent: "#fb7185", accent2: "#f97316" },
  { id: "plum", label: "Plum", accent: "#9333ea", accent2: "#c084fc" },
];

const themeFonts: ThemeFont[] = [
  { id: "space", label: "Space Grotesk", value: '"Space Grotesk", "Segoe UI", system-ui, sans-serif' },
  { id: "sarabun", label: "Sarabun", value: '"Sarabun", "Segoe UI", system-ui, sans-serif' },
];

type SidebarToggleProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

type ThemeController = {
  mode: string;
  setMode: (v: any) => void;
  paletteId: string;
  setPaletteId: (id: string) => void;
  fontId: string;
  setFontId: (id: string) => void;
};

export default function ThemeSettingsPage({
  isSidebarOpen,
  onToggleSidebar,
  theme,
}: SidebarToggleProps & { theme: ThemeController }) {
  return (
    <PageShell
      title="Theme"
      subtitle="Pick a primary color and font family."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
    >
      <section>
        <h2>Primary color</h2>
        <div className="theme-grid" style={{ marginTop: 8 }}>
          {themePalettes.map((palette) => (
            <Button
              key={palette.id}
              variant="flat"
              className={`theme-swatch${theme.paletteId === palette.id ? " is-active" : ""}`}
              onPress={() => theme.setPaletteId(palette.id)}
              style={{
                background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})`,
              }}
            >
              <span className="theme-swatch-label">{palette.label}</span>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginTop: 20 }}>Font</h2>
        <div className="theme-fonts" style={{ marginTop: 8 }}>
          {themeFonts.map((font) => (
            <Button
              key={font.id}
              variant={theme.fontId === font.id ? "solid" : "flat"}
              color={theme.fontId === font.id ? "primary" : "default"}
              className="theme-font-button"
              onPress={() => theme.setFontId(font.id)}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </Button>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
