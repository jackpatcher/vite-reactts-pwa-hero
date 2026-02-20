# Storage CRUD Operations Guide

## 📦 Import

```typescript
import {
  // ===== GENERIC CRUD (Works with ANY table/key) =====
  db,                    // Direct database access
  getTable,              // Get table instance
  create,                // Create item
  read,                  // Read item by key
  readAll,               // Read all items
  update,                // Update/Insert item
  patch,                 // Partial update
  remove,                // Delete item
  bulkUpdate,            // Bulk create/update
  bulkRemove,            // Bulk delete
  clearTable,            // Clear table
  count,                 // Count items
  query,                 // Query by field value
  where,                 // Advanced filtering
  
  // ===== Specific Config CRUD =====
  setConfig,
  getConfig,
  getAllConfigs,
  bulkSetConfig,
  removeConfig,
  clearAllConfigs,
  
  // ===== Specific AppState CRUD =====
  createAppState,
  getAppState,
  getAllAppStates,
  setAppState,
  updateAppState,
  bulkSetAppStates,
  deleteAppState,
  clearAllAppStates,
  
  // Query helpers
  getFavoriteApps,
  getInstalledApps,
  
  // Utility functions
  toggleFavorite,
  toggleInstalled,
  setFavorite,
  setInstalled,
} from "../modules/storage/indexedDb";
```

---

## 🌟 Generic CRUD (ใช้ได้กับทุก Table)

### Direct Table Access

```typescript
import { db, getTable } from "../modules/storage/indexedDb";

// Method 1: Direct access via db
const items = await db.config.toArray();
await db.appState.put({ appId: "app-001", isFavorite: true, isInstalled: false });

// Method 2: Dynamic table access
const table = getTable<AppState>("appState");
const allStates = await table.toArray();
```

### CREATE

```typescript
// Add new item to any table
await create("config", { key: "theme", value: { mode: "dark" } });
await create("appState", { appId: "app-001", isFavorite: false, isInstalled: true });

// Bulk create/update
await bulkUpdate("appState", [
  { appId: "app-001", isFavorite: true, isInstalled: true },
  { appId: "app-002", isFavorite: false, isInstalled: true },
]);
```

### READ

```typescript
// Read single item by primary key
const config = await read<ConfigEntry>("config", "theme");
const appState = await read<AppState>("appState", "app-001");

// Read all items
const allConfigs = await readAll<ConfigEntry>("config");
const allStates = await readAll<AppState>("appState");

// Count items
const totalApps = await count("appState");

// Query by field value
const favorites = await query<AppState>("appState", "isFavorite", true);
// Returns: [{ appId: "app-001", isFavorite: true, ... }]

// Advanced filtering
const installedFavorites = await where<AppState>(
  "appState",
  (item) => item.isFavorite && item.isInstalled
);
```

### UPDATE

```typescript
// Full replace (creates if not exists)
await update("appState", {
  appId: "app-001",
  isFavorite: true,
  isInstalled: true,
});

// Partial update (updates only specified fields)
await patch("appState", "app-001", { isFavorite: true });
await patch("config", "theme", { value: { mode: "light" } });
```

### DELETE

```typescript
// Delete single item
await remove("config", "theme");
await remove("appState", "app-001");

// Bulk delete
await bulkRemove("appState", ["app-001", "app-002", "app-003"]);

// Clear entire table
await clearTable("config");
await clearTable("appState");
```

### Example: Custom Table

```typescript
// Define your type
type UserPreference = {
  userId: string;
  language: string;
  notifications: boolean;
};

// Use generic CRUD
await create<UserPreference>("userPrefs", {
  userId: "user-123",
  language: "th",
  notifications: true,
});

const pref = await read<UserPreference>("userPrefs", "user-123");
await patch<UserPreference>("userPrefs", "user-123", { language: "en" });
const allPrefs = await readAll<UserPreference>("userPrefs");
```

---

## 🔧 Config Operations (Key-Value Store)

### CREATE / UPDATE

```typescript
// Set single config
await setConfig("theme", { mode: "dark", accent: "blue" });
await setConfig("launcher", "dashboard");

// Bulk set multiple configs
await bulkSetConfig({
  theme: { mode: "dark", accent: "blue" },
  launcher: "dashboard",
  onboarding: { completed: true },
});
```

### READ

```typescript
// Get single config
const theme = await getConfig<{ mode: string; accent: string }>("theme");
// { mode: "dark", accent: "blue" } | undefined

// Get all configs
const allConfigs = await getAllConfigs();
// { theme: {...}, launcher: "dashboard", ... }
```

### DELETE

```typescript
// Remove single config
await removeConfig("theme");

// Clear all configs
await clearAllConfigs();
```

---

## 📱 AppState Operations

### CREATE

```typescript
// Create new app state (default: not favorite, not installed)
await createAppState("app-001");

// Create with initial values
await createAppState("app-002", true, false); // favorite but not installed
```

### READ

```typescript
// Get single app state
const state = await getAppState("app-001");
// { appId: "app-001", isFavorite: false, isInstalled: false } | undefined

// Get all app states
const allStates = await getAllAppStates();
// [{ appId: "app-001", ... }, { appId: "app-002", ... }]

// Get filtered lists
const favorites = await getFavoriteApps();
// ["app-002", "app-005"]

const installed = await getInstalledApps();
// ["app-001", "app-003"]
```

### UPDATE

```typescript
// Full replace
await setAppState({
  appId: "app-001",
  isFavorite: true,
  isInstalled: true,
});

// Partial update (creates if not exists)
await updateAppState("app-001", { isFavorite: true });
await updateAppState("app-002", { isInstalled: true, isFavorite: false });

// Bulk update
await bulkSetAppStates([
  { appId: "app-001", isFavorite: true, isInstalled: true },
  { appId: "app-002", isFavorite: false, isInstalled: true },
]);
```

### DELETE

```typescript
// Delete single app state
await deleteAppState("app-001");

// Clear all app states
await clearAllAppStates();
```

---

## ⚡ Utility Functions

```typescript
// Toggle favorite (returns new value)
const isFavorite = await toggleFavorite("app-001"); // true

// Toggle installed
const isInstalled = await toggleInstalled("app-001"); // true

// Set specific value
await setFavorite("app-001", true);
await setInstalled("app-001", false);
```

---

## 🎯 Common Patterns

### 1. Create Custom Table and Use Generic CRUD

```typescript
// Step 1: Add table to schema (in indexedDb.ts - requires new version)
// this.version(4).stores({
//   config: "key",
//   appState: "appId, isFavorite, isInstalled",
//   userPrefs: "userId, lastActive", // New table with indexes
// });

// Step 2: Define your type
type UserPref = {
  userId: string;
  language: string;
  theme: string;
  lastActive: Date;
};

// Step 3: Use generic CRUD
async function manageUserPrefs() {
  // Create
  await create<UserPref>("userPrefs", {
    userId: "user-001",
    language: "th",
    theme: "dark",
    lastActive: new Date(),
  });

  // Read
  const pref = await read<UserPref>("userPrefs", "user-001");
  
  // Update partial
  await patch<UserPref>("userPrefs", "user-001", { theme: "light" });
  
  // Query
  const activeUsers = await where<UserPref>(
    "userPrefs",
    (user) => user.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  // Delete
  await remove("userPrefs", "user-001");
}
```

### 2. Flexible Key-Value Store for Any Data

```typescript
// Store any type of data using generic CRUD
type CacheEntry = { key: string; data: any; expiry: number };

// Save cache data
await create<CacheEntry>("cache", {
  key: "api-response-123",
  data: { items: [...] },
  expiry: Date.now() + 3600000,
});

// Read and filter expired
const validCache = await where<CacheEntry>(
  "cache",
  (entry) => entry.expiry > Date.now()
);
```

### 3. Cross-Table Queries

```typescript
async function getFullUserProfile(userId: string) {
  // Query multiple tables
  const [config, prefs, states] = await Promise.all([
    read("config", userId),
    read("userPrefs", userId),
    readAll<AppState>("appState"),
  ]);
  
  // Filter user's apps
  const userApps = states.filter(s => s.isInstalled);
  
  return { config, prefs, apps: userApps };
}
```

### 4. Initialize App on First Install

```typescript
async function handleInstall(appId: string) {
  await updateAppState(appId, { isInstalled: true });
  // If not exists, creates with { appId, isFavorite: false, isInstalled: true }
}

// Or use generic CRUD
async function handleInstallGeneric(appId: string) {
  const existing = await read<AppState>("appState", appId);
  await update("appState", {
    appId,
    isFavorite: existing?.isFavorite ?? false,
    isInstalled: true,
  });
}
```

### 5. Add to Favorites

```typescript
async function handleAddFavorite(appId: string) {
  const state = await getAppState(appId);
  if (!state?.isInstalled) {
    throw new Error("App must be installed first");
  }
  await setFavorite(appId, true);
}
```

### 3. Bulk Initialize Apps

```typescript
async function initializeApps(appIds: string[]) {
  const states = appIds.map(appId => ({
    appId,
    isFavorite: false,
    isInstalled: false,
  }));
  await bulkSetAppStates(states);
}
```

### 4. Get User Preferences

```typescript
async function loadUserPreferences() {
  const theme = await getConfig("theme");
  const launcher = await getConfig("launcher");
  const favorites = await getFavoriteApps();
  
  return { theme, launcher, favorites };
}
```

### 5. Reset Everything

```typescript
async function resetDatabase() {
  await clearAllConfigs();
  await clearAllAppStates();
}

// Or use generic CRUD for any tables
async function resetCustomTables(tableNames: string[]) {
  await Promise.all(tableNames.map(name => clearTable(name)));
}
```

### 6. Advanced Filtering and Queries

```typescript
// Complex filtering with generic where()
async function getActiveInstalledApps() {
  return await where<AppState>(
    "appState",
    (state) => state.isInstalled && !state.isFavorite
  );
}

// Multi-condition query
async function searchApps(criteria: Partial<AppState>) {
  const allStates = await readAll<AppState>("appState");
  return allStates.filter(state => 
    Object.entries(criteria).every(([key, value]) => state[key] === value)
  );
}
```

### 7. Batch Operations with Error Handling

```typescript
async function safeBulkUpdate<T>(tableName: string, items: T[]) {
  try {
    await bulkUpdate(tableName, items);
    return { success: true, count: items.length };
  } catch (error) {
    console.error(`Bulk update failed for ${tableName}:`, error);
    
    // Fallback: Update one by one
    let successCount = 0;
    for (const item of items) {
      try {
        await update(tableName, item);
        successCount++;
      } catch (e) {
        console.error("Failed to update item:", item, e);
      }
    }
    return { success: false, count: successCount };
  }
}
```

---

## 🔄 Reactive Updates (with useLiveQuery)

All CRUD operations automatically trigger reactive updates in components using `useLiveQuery` hooks:

```typescript
import { useFavoriteApps } from "../modules/storage";

function MyComponent() {
  // Auto-updates when favorites change
  const favorites = useFavoriteApps() ?? [];
  
  const addFavorite = async (appId: string) => {
    await setFavorite(appId, true);
    // UI updates automatically - no manual state management needed
  };
  
  return <div>Favorites: {favorites.length}</div>;
}
```

---

## 📝 Type Safety

All functions are fully typed:

```typescript
// Type-safe config
interface ThemeConfig {
  mode: "light" | "dark";
  accent: string;
}

await setConfig<ThemeConfig>("theme", { mode: "dark", accent: "blue" });
const theme = await getConfig<ThemeConfig>("theme"); // ThemeConfig | undefined

// Type-safe app state
const state: AppState | undefined = await getAppState("app-001");
```

---

## ⚠️ Error Handling

```typescript
try {
  await setConfig("key", value);
} catch (error) {
  console.error("Failed to save config:", error);
  // Handle Dexie errors (e.g., QuotaExceededError, DatabaseClosedError)
}
```

---

## 🚀 Performance Tips

1. **Use bulk operations** when updating multiple records
2. **Use partial updates** (`patch`, `updateAppState`) instead of full replace when possible
3. **Query with indexes** - indexed fields are much faster for queries
4. **Avoid unnecessary reads** - use `useLiveQuery` hooks to get reactive data instead of manual polling
5. **Use generic functions** for flexible, reusable code across any table

---

## 🏗️ How to Add New Tables

### Step 1: Update Schema in `indexedDb.ts`

```typescript
class AppDb extends Dexie {
  config!: Table<ConfigEntry, string>;
  appState!: Table<AppState, string>;
  userPrefs!: Table<UserPref, string>; // New table type declaration

  constructor() {
    super(DB_NAME);
    
    // ... existing versions ...
    
    // Version 4: Add userPrefs table
    this.version(4).stores({
      config: "key",
      appState: "appId, isFavorite, isInstalled",
      userPrefs: "userId, language, lastActive", // Primary key + indexes
    });
  }
}
```

### Step 2: Define Type

```typescript
export type UserPref = {
  userId: string;      // Primary key
  language: string;    // Indexed
  theme: string;
  notifications: boolean;
  lastActive: Date;    // Indexed
};
```

### Step 3: Use Generic CRUD (No new functions needed!)

```typescript
import { create, read, update, remove, query } from "../modules/storage";

// CREATE
await create<UserPref>("userPrefs", {
  userId: "user-001",
  language: "th",
  theme: "dark",
  notifications: true,
  lastActive: new Date(),
});

// READ
const pref = await read<UserPref>("userPrefs", "user-001");

// UPDATE
await patch<UserPref>("userPrefs", "user-001", { theme: "light" });

// DELETE
await remove("userPrefs", "user-001");

// QUERY by indexed field
const thaiUsers = await query<UserPref>("userPrefs", "language", "th");
```

### Step 4: (Optional) Create Custom Hook

```typescript
// In hooks.ts
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./indexedDb";

export function useUserPref(userId: string) {
  return useLiveQuery(() => db.table("userPrefs").get(userId), [userId]);
}

export function useAllUserPrefs() {
  return useLiveQuery(() => db.table("userPrefs").toArray(), []);
}
```

### Step 5: Use in Component

```typescript
import { useUserPref } from "../modules/storage";
import { patch } from "../modules/storage/indexedDb";

function UserSettings({ userId }: { userId: string }) {
  const pref = useUserPref(userId);
  
  const changeLanguage = async (lang: string) => {
    await patch("userPrefs", userId, { language: lang });
    // UI updates automatically!
  };
  
  return <div>Language: {pref?.language}</div>;
}
```

---

## 📋 Summary

### When to use what:

- **Generic CRUD** (`create`, `read`, `update`, `remove`, etc.) 
  - ✅ Universal - works with ANY table
  - ✅ No need to write new functions
  - ✅ Perfect for custom tables
  - ✅ Maximum flexibility

- **Specific functions** (`setConfig`, `updateAppState`, etc.)
  - ✅ More convenient for common operations
  - ✅ Better naming/semantics
  - ✅ Pre-configured for app/config tables

- **Direct table access** (`db.tableName.method()`)
  - ✅ Full Dexie API access
  - ✅ Advanced queries and transactions
  - ✅ Maximum control

**Best practice:** Use generic CRUD for flexibility, specific functions for convenience, direct access for advanced features.
