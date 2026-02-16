// ตัวอย่างการใช้ Generic CRUD Operations

import {
  // Generic CRUD - ใช้ได้กับทุก table
  db,
  getTable,
  create,
  read,
  readAll,
  update,
  patch,
  remove,
  bulkUpdate,
  clearTable,
  count,
  query,
  where,
} from "../modules/storage";

// ============================================
// Example 1: Direct Table Access
// ============================================
export async function example1_DirectAccess() {
  // เข้าถึง table โดยตรง (type-safe)
  const allConfigs = await db.config.toArray();
  const theme = await db.config.get("theme");
  
  await db.appState.put({
    appId: "app-001",
    isFavorite: true,
    isInstalled: true,
  });
  
  console.log("Configs:", allConfigs);
  console.log("Theme:", theme);
}

// ============================================
// Example 2: Dynamic Table Access
// ============================================
export async function example2_DynamicAccess(tableName: string) {
  // เข้าถึง table แบบ dynamic
  const table = getTable(tableName);
  const items = await table.toArray();
  const itemCount = await table.count();
  
  console.log(`${tableName} has ${itemCount} items:`, items);
}

// ============================================
// Example 3: Generic CRUD with Type Safety
// ============================================
type UserSettings = {
  userId: string;
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
};

export async function example3_TypeSafeCRUD() {
  // CREATE
  await create<UserSettings>("userSettings", {
    userId: "user-123",
    theme: "dark",
    language: "th",
    notifications: true,
  });
  
  // READ
  const settings = await read<UserSettings>("userSettings", "user-123");
  console.log("Settings:", settings);
  
  // UPDATE (partial)
  await patch<UserSettings>("userSettings", "user-123", { theme: "light" });
  
  // READ ALL
  const allSettings = await readAll<UserSettings>("userSettings");
  console.log("All settings:", allSettings);
  
  // COUNT
  const total = await count("userSettings");
  console.log("Total users:", total);
  
  // DELETE
  await remove("userSettings", "user-123");
}

// ============================================
// Example 4: Bulk Operations
// ============================================
export async function example4_BulkOperations() {
  const users: UserSettings[] = [
    { userId: "user-001", theme: "dark", language: "th", notifications: true },
    { userId: "user-002", theme: "light", language: "en", notifications: false },
    { userId: "user-003", theme: "dark", language: "th", notifications: true },
  ];
  
  // Bulk insert/update
  await bulkUpdate("userSettings", users);
  console.log("Inserted", users.length, "users");
  
  // Count
  const total = await count("userSettings");
  console.log("Total users:", total);
}

// ============================================
// Example 5: Query and Filter
// ============================================
export async function example5_QueryAndFilter() {
  // Query by indexed field (if field is indexed in schema)
  const thaiUsers = await query<UserSettings>("userSettings", "language", "th");
  console.log("Thai users:", thaiUsers);
  
  // Advanced filtering
  const darkThemeUsers = await where<UserSettings>(
    "userSettings",
    (user) => user.theme === "dark" && user.notifications
  );
  console.log("Dark theme users with notifications:", darkThemeUsers);
}

// ============================================
// Example 6: Working with Existing Tables
// ============================================
import type { AppState } from "../modules/storage/indexedDb";

export async function example6_ExistingTables() {
  // ใช้ generic CRUD กับ table ที่มีอยู่แล้ว
  
  // READ all app states
  const allStates = await readAll<AppState>("appState");
  console.log("All app states:", allStates);
  
  // Query favorites (isFavorite is indexed)
  const favorites = await query<AppState>("appState", "isFavorite", true);
  console.log("Favorite apps:", favorites.map(s => s.appId));
  
  // Complex filter
  const installedFavorites = await where<AppState>(
    "appState",
    (state) => !!(state.isInstalled && state.isFavorite)
  );
  console.log("Installed favorites:", installedFavorites);
  
  // Update specific app
  await patch<AppState>("appState", "app-001", { isFavorite: true });
  
  // Count total apps
  const totalApps = await count("appState");
  console.log("Total apps:", totalApps);
}

// ============================================
// Example 7: Cleanup Operations
// ============================================
export async function example7_Cleanup() {
  // Clear specific table
  await clearTable("userSettings");
  console.log("Cleared userSettings table");
  
  // Clear multiple tables
  const tablesToClear = ["config", "appState"];
  await Promise.all(tablesToClear.map(clearTable));
  console.log("Cleared all tables");
}

// ============================================
// Example 8: Error Handling
// ============================================
export async function example8_ErrorHandling() {
  try {
    await create("userSettings", {
      userId: "user-001",
      theme: "dark",
      language: "th",
      notifications: true,
    });
    console.log("User created successfully");
  } catch (error: any) {
    if (error.name === "ConstraintError") {
      console.error("User already exists");
    } else {
      console.error("Failed to create user:", error);
    }
  }
}

// ============================================
// Example 9: Universal Table Manager
// ============================================
export class TableManager<T> {
  private tableName: string;
  
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  async getAll(): Promise<T[]> {
    return await readAll<T>(this.tableName);
  }
  
  async getById(id: any): Promise<T | undefined> {
    return await read<T>(this.tableName, id);
  }
  
  async create(item: T): Promise<void> {
    await create<T>(this.tableName, item);
  }
  
  async update(item: T): Promise<void> {
    await update<T>(this.tableName, item);
  }
  
  async partialUpdate(id: any, updates: Partial<T>): Promise<void> {
    await patch<T>(this.tableName, id, updates);
  }
  
  async delete(id: any): Promise<void> {
    await remove(this.tableName, id);
  }
  
  async count(): Promise<number> {
    return await count(this.tableName);
  }
  
  async clear(): Promise<void> {
    await clearTable(this.tableName);
  }
}

// Usage:
export async function example9_TableManager() {
  const appStateManager = new TableManager<AppState>("appState");
  
  const allApps = await appStateManager.getAll();
  await appStateManager.partialUpdate("app-001", { isFavorite: true });
  const total = await appStateManager.count();
  
  console.log("Managed apps:", allApps.length, "Total:", total);
}
