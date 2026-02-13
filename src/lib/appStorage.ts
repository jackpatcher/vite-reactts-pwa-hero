type ThemeStorage = {
  mode?: string;
  paletteId?: string;
  fontId?: string;
};

type LauncherStorage = {
  selectedId?: string | null;
};

type AppStorageState = {
  theme?: ThemeStorage;
  favorites?: string[];
  installed?: string[];
  tags?: Record<string, string[]>;
  launcher?: LauncherStorage;
};

const STORAGE_KEY = "Ambridge";

const PREVIOUS_STORAGE_KEYS = ["AMPLIFY"];

const LEGACY_KEYS = {
  theme: "Theme",
  favorites: "favoriteApps:v1",
  launcher: "favoriteApps:launcher:v1",
  installed: "installedApps:v1",
  tags: "appTags:v1",
};

const STALE_THEME_KEYS = ["theme-mode", "theme-font", "theme-palette"];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readState(): AppStorageState {
  migrateLegacyIfNeeded();
  const raw = localStorage.getItem(STORAGE_KEY);
  return safeParse<AppStorageState>(raw, {});
}

function writeState(next: AppStorageState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function mergeState(partial: AppStorageState) {
  const current = readState();
  writeState({
    ...current,
    ...partial,
    theme: { ...current.theme, ...partial.theme },
    launcher: { ...current.launcher, ...partial.launcher },
    tags: { ...current.tags, ...partial.tags },
  });
}

function migrateLegacyIfNeeded() {
  const hasStorage = Boolean(localStorage.getItem(STORAGE_KEY));
  STALE_THEME_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
  if (hasStorage) {
    PREVIOUS_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    return;
  }

  for (const key of PREVIOUS_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsed = safeParse<AppStorageState>(raw, {});
    writeState(parsed);
    localStorage.removeItem(key);
    Object.values(LEGACY_KEYS).forEach((legacyKey) => {
      localStorage.removeItem(legacyKey);
    });
    return;
  }

  const theme = safeParse<ThemeStorage>(localStorage.getItem(LEGACY_KEYS.theme), {});
  const favorites = safeParse<string[]>(localStorage.getItem(LEGACY_KEYS.favorites), []);
  const installed = safeParse<string[]>(localStorage.getItem(LEGACY_KEYS.installed), []);
  const tags = safeParse<Record<string, string[]>>(localStorage.getItem(LEGACY_KEYS.tags), {});
  const launcher = safeParse<LauncherStorage>(
    localStorage.getItem(LEGACY_KEYS.launcher),
    {}
  );

  const hasLegacyData =
    Object.keys(theme).length > 0 ||
    favorites.length > 0 ||
    installed.length > 0 ||
    Object.keys(tags).length > 0 ||
    Object.keys(launcher).length > 0;

  if (!hasLegacyData) return;

  writeState({
    theme,
    favorites,
    installed,
    tags,
    launcher,
  });

  Object.values(LEGACY_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });

}

export function readTheme(): ThemeStorage | null {
  const state = readState();
  return state.theme ?? null;
}

export function writeTheme(next: ThemeStorage) {
  mergeState({ theme: next });
}

export function readFavorites(): string[] {
  const state = readState();
  return state.favorites ?? [];
}

export function writeFavorites(next: string[]) {
  mergeState({ favorites: next });
}

export function readInstalled(): string[] {
  const state = readState();
  return state.installed ?? [];
}

export function writeInstalled(next: string[]) {
  mergeState({ installed: next });
}

export function readTags(): Record<string, string[]> {
  const state = readState();
  return state.tags ?? {};
}

export function writeTags(next: Record<string, string[]>) {
  mergeState({ tags: next });
}

export function readLauncherSelection(): string | null {
  const state = readState();
  return state.launcher?.selectedId ?? null;
}

export function writeLauncherSelection(selectedId: string | null) {
  mergeState({ launcher: { selectedId } });
}
