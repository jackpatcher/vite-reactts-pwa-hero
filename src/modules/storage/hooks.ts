import { useLiveQuery } from "dexie-react-hooks";
import { db, getConfig } from "./indexedDb";
import type { LauncherStorage, FirstTimeSetupStorage, ThemeStorage } from "../../lib/appStorage";

// Theme hook
export function useTheme() {
  return useLiveQuery(async () => {
    return await getConfig<ThemeStorage>("theme");
  });
}

// Favorites hook
export function useFavoriteApps(): string[] | undefined {
  return useLiveQuery(async () => {
    const states = await db.appState.where("isFavorite").equals(1 as any).toArray();
    return states.map((s) => s.appId);
  });
}

// Installed apps hook
export function useInstalledApps(): string[] | undefined {
  return useLiveQuery(async () => {
    const states = await db.appState.where("isInstalled").equals(1 as any).toArray();
    return states.map((s) => s.appId);
  });
}

// All app states hook
export function useAllAppStates() {
  return useLiveQuery(() => db.appState.toArray(), [], []);
}

// Launcher selection hook
export function useLauncherSelection() {
  return useLiveQuery(async () => {
    const launcher = await getConfig<LauncherStorage>("launcher");
    return launcher?.selectedId ?? null;
  });
}

// FirstTimeSetup hook
export function useFirstTimeSetup() {
  return useLiveQuery(async () => {
    return await getConfig<FirstTimeSetupStorage>("firstTimeSetup");
  });
}

// Is first time hook
export function useIsFirstTime() {
  return useLiveQuery(async () => {
    const setup = await getConfig<FirstTimeSetupStorage>("firstTimeSetup");
    return !setup?.isFirstTimeSetupDone;
  }, [], true);
}
