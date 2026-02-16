import Dexie, { type Table } from "dexie";

const DB_NAME = "ambridge-db";

export type ConfigEntry = {
  key: string;
  value: unknown;
};

export type AppState = {
  appId: string;
  isFavorite: boolean | number;
  isInstalled: boolean | number;
};

class AppDb extends Dexie {
  config!: Table<ConfigEntry, string>;
  appState!: Table<AppState, string>;

  constructor() {
    super(DB_NAME);
    
    // Version 1: Initial schema with config, appState, and appTags
    this.version(1).stores({
      config: "key",
      appState: "appId",
      appTags: "++id, appId, tag, [appId+tag]",
    });
    
    // Version 2: Remove appTags table
    this.version(2).stores({
      config: "key",
      appState: "appId",
      appTags: null, // Delete the table
    });
    
    // Version 3: Add indexes for isFavorite and isInstalled to enable filtering
    this.version(3).stores({
      config: "key",
      appState: "appId, isFavorite, isInstalled",
    });
  }
}

const db = new AppDb();

// ==================== Generic CRUD Operations (Works with ANY table) ====================

/**
 * Get table by name - use this for dynamic table access
 * @example 
 * const table = getTable<AppState>("appState");
 * const items = await table.toArray();
 */
export function getTable<T = any, TKey = any>(tableName: string): Table<T, TKey> {
  return db.table(tableName);
}

/**
 * Generic CREATE - Add item to any table
 */
export async function create<T>(tableName: string, item: T): Promise<void> {
  await db.table(tableName).add(item);
}

/**
 * Generic READ - Get item by primary key
 */
export async function read<T>(tableName: string, key: any): Promise<T | undefined> {
  return await db.table(tableName).get(key);
}

/**
 * Generic READ ALL - Get all items from table
 */
export async function readAll<T>(tableName: string): Promise<T[]> {
  return await db.table(tableName).toArray();
}

/**
 * Generic UPDATE - Update/Insert item
 */
export async function update<T>(tableName: string, item: T): Promise<void> {
  await db.table(tableName).put(item);
}

/**
 * Generic PARTIAL UPDATE - Update specific fields by key
 */
export async function patch<T>(tableName: string, key: any, updates: Partial<T>): Promise<void> {
  await db.table(tableName).update(key, updates);
}

/**
 * Generic DELETE - Delete item by key
 */
export async function remove(tableName: string, key: any): Promise<void> {
  await db.table(tableName).delete(key);
}

/**
 * Generic BULK CREATE/UPDATE
 */
export async function bulkUpdate<T>(tableName: string, items: T[]): Promise<void> {
  await db.table(tableName).bulkPut(items);
}

/**
 * Generic BULK DELETE
 */
export async function bulkRemove(tableName: string, keys: any[]): Promise<void> {
  await db.table(tableName).bulkDelete(keys);
}

/**
 * Generic CLEAR - Clear all items in table
 */
export async function clearTable(tableName: string): Promise<void> {
  await db.table(tableName).clear();
}

/**
 * Generic COUNT - Get count of items
 */
export async function count(tableName: string): Promise<number> {
  return await db.table(tableName).count();
}

/**
 * Generic QUERY - Filter items by field value
 */
export async function query<T>(
  tableName: string,
  field: string,
  value: any
): Promise<T[]> {
  return await db.table(tableName).where(field).equals(value).toArray();
}

/**
 * Generic WHERE - Advanced filtering
 */
export async function where<T>(
  tableName: string,
  filter: (item: T) => boolean
): Promise<T[]> {
  return await db.table(tableName).filter(filter).toArray();
}

// ==================== Config CRUD Operations ====================

// CREATE / UPDATE
export async function setConfig<T>(key: string, value: T): Promise<void> {
  await db.config.put({ key, value });
}

export async function bulkSetConfig(entries: Record<string, unknown>): Promise<void> {
  const records = Object.entries(entries).map(([key, value]) => ({ key, value }));
  await db.config.bulkPut(records);
}

// READ
export async function getConfig<T>(key: string): Promise<T | undefined> {
  const entry = await db.config.get(key);
  return entry?.value as T | undefined;
}

export async function getAllConfigs(): Promise<Record<string, unknown>> {
  const entries = await db.config.toArray();
  return Object.fromEntries(entries.map((e) => [e.key, e.value]));
}

// DELETE
export async function removeConfig(key: string): Promise<void> {
  await db.config.delete(key);
}

export async function clearAllConfigs(): Promise<void> {
  await db.config.clear();
}

// ==================== AppState CRUD Operations ====================

// CREATE
export async function createAppState(appId: string, isFavorite = false, isInstalled = false): Promise<void> {
  await db.appState.add({ appId, isFavorite, isInstalled });
}

// READ
export async function getAppState(appId: string): Promise<AppState | undefined> {
  return await db.appState.get(appId);
}

export async function getAllAppStates(): Promise<AppState[]> {
  return await db.appState.toArray();
}

export async function getFavoriteApps(): Promise<string[]> {
  const states = await db.appState.where("isFavorite").equals(1 as any).toArray();
  return states.map((s) => s.appId);
}

export async function getInstalledApps(): Promise<string[]> {
  const states = await db.appState.where("isInstalled").equals(1 as any).toArray();
  return states.map((s) => s.appId);
}

// UPDATE
export async function setAppState(state: AppState): Promise<void> {
  function toNum(val: boolean|number|undefined) { return val === true ? 1 : val === false ? 0 : val; }
  await db.appState.put({
    ...state,
    isFavorite: toNum(state.isFavorite) as number,
    isInstalled: toNum(state.isInstalled) as number,
  });
}

export async function updateAppState(appId: string, updates: Partial<Omit<AppState, "appId">>): Promise<void> {
  const existing = await db.appState.get(appId);
  // eslint-disable-next-line no-console
  console.log('DEBUG: updateAppState before', appId, existing, updates);
  function toNum(val: boolean|number|undefined): number { return val === true ? 1 : val === false ? 0 : 0; }
  if (existing) {
    const newState = {
      ...existing,
      ...updates,
      appId,
      isFavorite: toNum(typeof updates.isFavorite !== 'undefined' ? updates.isFavorite : existing.isFavorite),
      isInstalled: toNum(typeof updates.isInstalled !== 'undefined' ? updates.isInstalled : existing.isInstalled),
    };
    await db.appState.put(newState);
    // eslint-disable-next-line no-console
    console.log('DEBUG: updateAppState after put', appId, await db.appState.get(appId));
  } else {
    const newState = {
      appId,
      isFavorite: toNum(updates.isFavorite ?? false),
      isInstalled: toNum(updates.isInstalled ?? false),
    };
    await db.appState.put(newState);
    // eslint-disable-next-line no-console
    console.log('DEBUG: updateAppState after put (new)', appId, await db.appState.get(appId));
  }
}

export async function bulkSetAppStates(states: AppState[]): Promise<void> {
  await db.appState.bulkPut(states);
}

// DELETE
export async function deleteAppState(appId: string): Promise<void> {
  await db.appState.delete(appId);
}

export async function clearAllAppStates(): Promise<void> {
  await db.appState.clear();
}

// ==================== Utility / Helper Functions ====================

export async function toggleFavorite(appId: string): Promise<boolean> {
  const state = await getAppState(appId);
  const newValue = !state?.isFavorite;
  await updateAppState(appId, { isFavorite: newValue });
  return newValue;
}

export async function toggleInstalled(appId: string): Promise<boolean> {
  const state = await getAppState(appId);
  const newValue = !state?.isInstalled;
  await updateAppState(appId, { isInstalled: newValue });
  return newValue;
}

export async function setFavorite(appId: string, value: boolean): Promise<void> {
  await updateAppState(appId, { isFavorite: value });
}

export async function setInstalled(appId: string, value: boolean): Promise<void> {
  await updateAppState(appId, { isInstalled: value });
}

// Legacy compatibility
export async function getItem<T>(key: string): Promise<T | undefined> {
  return await getConfig<T>(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await setConfig(key, value);
}

export async function removeItem(key: string): Promise<void> {
  await removeConfig(key);
}

export async function clearStore(): Promise<void> {
  await db.config.clear();
  await db.appState.clear();
}

export { db };
