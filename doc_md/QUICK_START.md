# 🚀 Quick Start: Generic CRUD Usage

## การติดตั้ง Schema (ครั้งเดียว)

### 1. เพิ่ม Table ใหม่ใน `indexedDb.ts`

```typescript
// src/modules/storage/indexedDb.ts

class AppDb extends Dexie {
  config!: Table<ConfigEntry, string>;
  appState!: Table<AppState, string>;
  
  // เพิ่ม type declarations สำหรับ tables ใหม่
  todos!: Table<Todo, string>;
  notes!: Table<Note, string>;
  userProfiles!: Table<UserProfile, string>;

  constructor() {
    super(DB_NAME);
    
    // ... versions อื่นๆ ...
    
    // Version 4: เพิ่ม tables ใหม่
    this.version(4).stores({
      config: "key",
      appState: "appId, isFavorite, isInstalled",
      todos: "id, completed, createdAt",      // ← table ใหม่
      notes: "id, isPinned, color, createdAt", // ← table ใหม่
      userProfiles: "userId, lastLogin",       // ← table ใหม่
    });
  }
}

// Define types
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  createdAt: Date;
  isPinned: boolean;
};

export type UserProfile = {
  userId: string;
  name: string;
  email: string;
  preferences: {
    theme: "light" | "dark";
    language: string;
    notifications: boolean;
  };
  lastLogin: Date;
};
```

---

## 📝 ตัวอย่างการใช้งาน

### 1️⃣ CREATE - สร้างข้อมูลใหม่

```typescript
import { create } from "../modules/storage";

// สร้าง todo ใหม่
const newTodo: Todo = {
  id: `todo-${Date.now()}`,
  title: "Buy groceries",
  completed: false,
  createdAt: new Date(),
};

await create<Todo>("todos", newTodo);
console.log("✅ Todo created!");
```

### 2️⃣ READ - อ่านข้อมูล

```typescript
import { read, readAll } from "../modules/storage";

// อ่าน 1 รายการ
const todo = await read<Todo>("todos", "todo-123");
console.log("Todo:", todo);

// อ่านทั้งหมด
const allTodos = await readAll<Todo>("todos");
console.log("All todos:", allTodos);
```

### 3️⃣ UPDATE - แก้ไขข้อมูล

```typescript
import { update, patch } from "../modules/storage";

// Update ทั้งหมด (replace)
await update<Todo>("todos", {
  id: "todo-123",
  title: "Buy groceries (updated)",
  completed: true,
  createdAt: new Date(),
});

// Update บางส่วน (แนะนำ)
await patch<Todo>("todos", "todo-123", { 
  completed: true 
});
```

### 4️⃣ DELETE - ลบข้อมูล

```typescript
import { remove } from "../modules/storage";

// ลบ 1 รายการ
await remove("todos", "todo-123");
console.log("🗑️ Todo deleted!");
```

### 5️⃣ QUERY - ค้นหาและกรอง

```typescript
import { query, where, count } from "../modules/storage";

// Query ตาม field (ต้อง indexed)
const completedTodos = await query<Todo>("todos", "completed", true);
console.log("Completed todos:", completedTodos);

// Filter แบบซับซ้อน
const recentTodos = await where<Todo>(
  "todos",
  (todo) => todo.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
);
console.log("Recent todos:", recentTodos);

// นับจำนวน
const total = await count("todos");
console.log("Total todos:", total);
```

### 6️⃣ BULK OPERATIONS - จัดการหลายรายการพร้อมกัน

```typescript
import { bulkUpdate, bulkRemove, clearTable } from "../modules/storage";

// Insert/Update หลายรายการ
const todos: Todo[] = [
  { id: "todo-1", title: "Task 1", completed: false, createdAt: new Date() },
  { id: "todo-2", title: "Task 2", completed: false, createdAt: new Date() },
  { id: "todo-3", title: "Task 3", completed: false, createdAt: new Date() },
];
await bulkUpdate("todos", todos);

// ลบหลายรายการ
await bulkRemove("todos", ["todo-1", "todo-2"]);

// ลบทั้งหมด
await clearTable("todos");
```

---

## 🎯 Real-World Examples

### ตัวอย่างที่ 1: Todo List Component

```typescript
import { useEffect, useState } from "react";
import { create, readAll, patch, remove } from "../modules/storage";

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // Load todos
  useEffect(() => {
    async function load() {
      const data = await readAll<Todo>("todos");
      setTodos(data);
    }
    void load();
  }, []);

  // Add todo
  const addTodo = async () => {
    const todo: Todo = {
      id: `todo-${Date.now()}`,
      title: newTitle,
      completed: false,
      createdAt: new Date(),
    };
    await create<Todo>("todos", todo);
    setTodos([...todos, todo]);
    setNewTitle("");
  };

  // Toggle complete
  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await patch<Todo>("todos", id, { completed: !todo.completed });
      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    await remove("todos", id);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div>
      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.title}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### ตัวอย่างที่ 2: User Settings

```typescript
import { read, patch } from "../modules/storage";

async function updateTheme(userId: string, theme: "light" | "dark") {
  const profile = await read<UserProfile>("userProfiles", userId);
  
  if (profile) {
    await patch<UserProfile>("userProfiles", userId, {
      preferences: {
        ...profile.preferences,
        theme,
      },
    });
    console.log("✅ Theme updated!");
  }
}

// ใช้งาน
await updateTheme("user-123", "dark");
```

### ตัวอย่างที่ 3: Search & Filter

```typescript
import { readAll } from "../modules/storage";

async function searchNotes(searchTerm: string) {
  const allNotes = await readAll<Note>("notes");
  
  return allNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// ใช้งาน
const results = await searchNotes("meeting");
console.log("Found notes:", results);
```

### ตัวอย่างที่ 4: Statistics

```typescript
import { count, query } from "../modules/storage";

async function getStatistics() {
  const totalTodos = await count("todos");
  const completedTodos = await query<Todo>("todos", "completed", true);
  
  return {
    total: totalTodos,
    completed: completedTodos.length,
    pending: totalTodos - completedTodos.length,
    completionRate: (completedTodos.length / totalTodos) * 100,
  };
}

// ใช้งาน
const stats = await getStatistics();
console.log("Stats:", stats);
```

---

## ⚡ Tips & Best Practices

### ✅ DO

```typescript
// ใช้ type safety
const todo = await read<Todo>("todos", id);

// ใช้ partial update แทน full replace
await patch<Todo>("todos", id, { completed: true });

// ใช้ bulk operations สำหรับข้อมูลเยอะ
await bulkUpdate("todos", manyTodos);

// Handle errors
try {
  await create("todos", newTodo);
} catch (error) {
  console.error("Failed:", error);
}
```

### ❌ DON'T

```typescript
// อย่าใช้ any type
const todo = await read("todos", id); // ❌ missing type

// อย่า update ทั้งหมดถ้าต้องการแค่บางส่วน
await update("todos", { ...todo, completed: true }); // ❌ ใช้ patch แทน

// อย่า loop เรียก create หลายรอบ
for (const item of items) {
  await create("todos", item); // ❌ ช้า
}
// ใช้ bulkUpdate แทน ✅
await bulkUpdate("todos", items);
```

---

## 🎓 Advanced: Custom Hook

```typescript
// useGenericCrud.ts
import { useState, useEffect } from "react";
import { readAll } from "../modules/storage";

export function useTable<T>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const items = await readAll<T>(tableName);
    setData(items);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, [tableName]);

  return { data, loading, refresh };
}

// ใช้งาน
function MyComponent() {
  const { data: todos, loading, refresh } = useTable<Todo>("todos");
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {todos.map(todo => <div key={todo.id}>{todo.title}</div>)}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

---

## 📚 ดูเพิ่มเติม

- [CRUD_GUIDE.md](./CRUD_GUIDE.md) - คู่มือฉบับสมบูรณ์
- [GenericCrudDemo.tsx](../examples/GenericCrudDemo.tsx) - Component ตัวอย่าง
- [genericCrudExample.tsx](../examples/genericCrudExample.tsx) - Function ตัวอย่าง

---

## 🎉 Summary

**Generic CRUD ทำให้คุณ:**
- ✅ ไม่ต้องเขียน function ใหม่สำหรับทุก table
- ✅ Type-safe ทั้งหมด
- ✅ ใช้งานง่าย เข้าใจง่าย
- ✅ Flexible - ทำงานกับ table ไหนก็ได้

**เพียงแค่:**
1. เพิ่ม table ใน schema
2. Define type
3. เรียกใช้ generic functions ได้เลย!
