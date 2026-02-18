import {
  getAllAppStates,
  getConfig,
  getFavoriteApps,
  getInstalledApps,
  setAppState,
  setConfig,
  removeConfig,
  bulkSetAppStates,
  deleteAppState,
} from "../modules/storage/indexedDb";
import { hashValue, isProbablyHashed } from "./secure.js";

export type ThemeStorage = {
  mode?: string;
  paletteId?: string;
  fontId?: string;
};

export type LauncherStorage = {
  selectedId?: string | null;
};

export type FirstTimeSetupStorage = {
  SchoolID: string;
  SchoolPass: string;
  Username: string;
  Password: string;
  isFirstTimeSetupDone?: boolean;
};

type AppStorageState = {
  theme?: ThemeStorage;
    isFirstTimeSetupDone?: boolean; // Added new property
  favorites?: string[];
  installed?: string[];
  launcher?: LauncherStorage;
  firstTimeSetup?: FirstTimeSetupStorage;
};

const STORAGE_KEY = "Ambridge";
const THEME_KEY = "theme";
const LAUNCHER_KEY = "launcher";

const FIRST_TIME_SETUP_KEY = "firstTimeSetup";
const PREVIOUS_STORAGE_KEYS = ["AMPLIFY"];

const LEGACY_KEYS = {
  theme: "Theme",
  favorites: "favoriteApps:v1",
  launcher: "favoriteApps:launcher:v1",
  installed: "installedApps:v1",
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

// Migration flag to avoid repeated checks
let migrationCompleted = false;

async function migrateLegacyIfNeeded() {
  if (migrationCompleted) return;

  const existing = await getConfig<ThemeStorage>(THEME_KEY);
  STALE_THEME_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
  await removeConfig("onboarding");

  // If we have data in new format, clean up old keys
  if (existing) {
    PREVIOUS_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem(STORAGE_KEY);
    migrationCompleted = true;
    return;
  }

  // Try to migrate from localStorage STORAGE_KEY
  const currentRaw = localStorage.getItem(STORAGE_KEY);
  if (currentRaw) {
    const parsed = safeParse<AppStorageState>(currentRaw, {});
    await migrateStateToTables(parsed);
    localStorage.removeItem(STORAGE_KEY);
    PREVIOUS_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    migrationCompleted = true;
    return;
  }

  // Try to migrate from PREVIOUS_STORAGE_KEYS
  for (const key of PREVIOUS_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const parsed = safeParse<AppStorageState>(raw, {});
    await migrateStateToTables(parsed);
    localStorage.removeItem(key);
    Object.values(LEGACY_KEYS).forEach((legacyKey) => {
      localStorage.removeItem(legacyKey);
    });
    migrationCompleted = true;
    return;
  }

  // Try to migrate from individual LEGACY_KEYS
  const theme = safeParse<ThemeStorage>(localStorage.getItem(LEGACY_KEYS.theme), {});
  const favorites = safeParse<string[]>(localStorage.getItem(LEGACY_KEYS.favorites), []);
  const installed = safeParse<string[]>(localStorage.getItem(LEGACY_KEYS.installed), []);
  const launcher = safeParse<LauncherStorage>(
    localStorage.getItem(LEGACY_KEYS.launcher),
    {}
  );

  const hasLegacyData =
    Object.keys(theme).length > 0 ||
    favorites.length > 0 ||
    installed.length > 0 ||
    Object.keys(launcher).length > 0;

  if (hasLegacyData) {
    await migrateStateToTables({
      theme,
      favorites,
      installed,
      launcher,
    });

    Object.values(LEGACY_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  migrationCompleted = true;
}

async function migrateStateToTables(state: AppStorageState) {
  // Migrate theme
  if (state.theme && Object.keys(state.theme).length > 0) {
    await setConfig(THEME_KEY, state.theme);
  }

  // Migrate launcher
  if (state.launcher && Object.keys(state.launcher).length > 0) {
    await setConfig(LAUNCHER_KEY, state.launcher);
  }

  // Migrate firstTimeSetup
  if (state.firstTimeSetup && Object.keys(state.firstTimeSetup).length > 0) {
    await setConfig(FIRST_TIME_SETUP_KEY, state.firstTimeSetup);
  }

  // Migrate favorites and installed into appState table
  const favSet = new Set(state.favorites ?? []);
  const instSet = new Set(state.installed ?? []);
  const allAppIds = new Set([...favSet, ...instSet]);

  for (const appId of allAppIds) {
    await setAppState({
      appId,
      isFavorite: favSet.has(appId),
      isInstalled: instSet.has(appId),
    });
  }
}

// Theme operations
export async function readTheme(): Promise<ThemeStorage | null> {
  await migrateLegacyIfNeeded();
  return (await getConfig<ThemeStorage>(THEME_KEY)) ?? null;
}

export async function writeTheme(next: ThemeStorage) {
  await setConfig(THEME_KEY, next);
}

// Favorites operations
export async function readFavorites(): Promise<string[]> {
  await migrateLegacyIfNeeded();
  return await getFavoriteApps();
}

export async function writeFavorites(next: string[]) {
  const states = await getAllAppStates();
  const stateMap = new Map(states.map((s) => [s.appId, s]));
  const favSet = new Set(next);

  // Update all affected apps
  for (const appId of [...favSet, ...stateMap.keys()]) {
    const existing = stateMap.get(appId);
    const isFavorite = favSet.has(appId);
    const isInstalled = existing?.isInstalled ?? false;

    if (isFavorite || isInstalled) {
      await setAppState({ appId, isFavorite, isInstalled });
    }
  }
}

// Installed operations
export async function readInstalled(): Promise<string[]> {
  await migrateLegacyIfNeeded();
  return await getInstalledApps();
}

export async function writeInstalled(next: string[]) {
  const states = await getAllAppStates();
  const stateMap = new Map(states.map((s) => [s.appId, s]));
  const instSet = new Set(next);

  // Prepare new states for all affected apps
  const allAppIds = new Set([...instSet, ...stateMap.keys()]);
  const toSave = [];
  for (const appId of allAppIds) {
    const existing = stateMap.get(appId);
    const isFavorite = existing?.isFavorite ?? false;
    const isInstalled = instSet.has(appId);
    if (isFavorite || isInstalled) {
      toSave.push({ appId, isFavorite, isInstalled });
    }
  }
  await bulkSetAppStates(toSave);
  // Remove appState if neither favorite nor installed
  for (const appId of allAppIds) {
    const existing = stateMap.get(appId);
    const isFavorite = existing?.isFavorite ?? false;
    const isInstalled = instSet.has(appId);
    if (!isFavorite && !isInstalled) {
      await deleteAppState(appId);
    }
  }
}

// Launcher operations
export async function readLauncherSelection(): Promise<string | null> {
  await migrateLegacyIfNeeded();
  const launcher = await getConfig<LauncherStorage>(LAUNCHER_KEY);
  return launcher?.selectedId ?? null;
}

export async function writeLauncherSelection(selectedId: string | null) {
  await setConfig<LauncherStorage>(LAUNCHER_KEY, { selectedId });
}


// FirstTimeSetup operations
export async function readFirstTimeSetup(): Promise<FirstTimeSetupStorage | null> {
  await migrateLegacyIfNeeded();
  return (await getConfig<FirstTimeSetupStorage>(FIRST_TIME_SETUP_KEY)) ?? null;
}

export async function writeFirstTimeSetup(next: FirstTimeSetupStorage) {
  // Ensure passwords are stored as irreversible hashes.
  const schoolPass = next.SchoolPass ?? "";
  const password = next.Password ?? "";

  const hashedSchoolPass = schoolPass && !isProbablyHashed(schoolPass) ? await hashValue(schoolPass, 100000, 8) : schoolPass;
  const hashedPassword = password && !isProbablyHashed(password) ? await hashValue(password, 100000, 8) : password;

  await setConfig(FIRST_TIME_SETUP_KEY, {
    ...next,
    SchoolPass: hashedSchoolPass,
    Password: hashedPassword,
  });
}

export async function isFirstTimeSetupNeeded(): Promise<boolean> {
  await migrateLegacyIfNeeded();
  const setup = await getConfig<FirstTimeSetupStorage>(FIRST_TIME_SETUP_KEY);
  return !setup?.isFirstTimeSetupDone;
}

export async function completeFirstTimeSetup(next?: FirstTimeSetupStorage): Promise<void> {
  const rawSchoolPass = next?.SchoolPass ?? "";
  const rawPassword = next?.Password ?? "";

  const SchoolPass = rawSchoolPass && !isProbablyHashed(rawSchoolPass) ? await hashValue(rawSchoolPass, 100000, 8) : rawSchoolPass;
  const Password = rawPassword && !isProbablyHashed(rawPassword) ? await hashValue(rawPassword, 100000, 8) : rawPassword;

  const payload: FirstTimeSetupStorage = {
    SchoolID: next?.SchoolID ?? "",
    SchoolPass,
    Username: next?.Username ?? "",
    Password,
    isFirstTimeSetupDone: true,
  };
  await setConfig<FirstTimeSetupStorage>(FIRST_TIME_SETUP_KEY, payload);
  await removeConfig("onboarding");
}
