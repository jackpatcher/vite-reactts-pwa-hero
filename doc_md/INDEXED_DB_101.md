# 📚 IndexedDB ครบบทบาท - เข้าใจง่ายๆ

## ❓ IndexedDB ไม่ใช่ Key-Value!

### ❌ ผิด: "IndexedDB = Key-Value Store"
IndexedDB **ไม่เพียงแค่** เก็บ key-value ธรรมดา

### ✅ ถูก: "IndexedDB = NoSQL Object Store"
IndexedDB เก็บ **Structured Objects** ที่สามารถมี properties หลายตัว (คล้าย columns)

---

## 🎯 วิธีคิด: Object vs Document

### แบบ Key-Value ธรรมดา (ไม่ดีเท่า)
```typescript
{
  "theme": "dark",
  "launcher": "dashboard",
  "user-001": "John Doe",
}
```
❌ ดูสับสน, ค้นหายาก, ไม่สามารถ filter ตามข้อมูลได้

### แบบ Structured Objects/Documents (ดี! 👍)
```typescript
// config table - มี columns
[
  { key: "theme", value: { mode: "dark", accent: "blue" } },
  { key: "launcher", value: "dashboard" },
]

// appState table - มี columns  
[
  { appId: "app-001", isFavorite: true, isInstalled: true },
  { appId: "app-002", isFavorite: false, isInstalled: false },
]

// todo table - มี columns
[
  { id: "todo-1", title: "Buy groceries", completed: false, createdAt: "2026-02-16" },
  { id: "todo-2", title: "Pay bills", completed: true, createdAt: "2026-02-15" },
]
```

✅ ชัดเจน, ค้นหาได้, สามารถ filter ตาม properties

---

## 🛠️ วิธีสร้าง "Columns" เอง

### Step 1: Define Type (Structure)
```typescript
// นี่คือ "schema" - กำหนด columns ไม่ต้องระบุใน IndexedDB
type UserProfile = {
  userId: string;           // Primary key (ต้องมี)
  name: string;             // Column 1
  email: string;            // Column 2
  theme: "light" | "dark";  // Column 3
  language: string;         // Column 4
  notifications: boolean;   // Column 5
  lastLogin: Date;          // Column 6
};
```

### Step 2: เพิ่ม Table ใน Schema (indexedDb.ts)
```typescript
// ใน AppDb constructor
this.version(5).stores({
  config: "key",
  appState: "appId, isFavorite, isInstalled",
  userProfiles: "userId, language, lastLogin",  // ← เพิ่ม table ใหม่
});
```

### Step 3: ใช้งาน
```typescript
import { create, readAll, patch } from "../modules/storage";

// CREATE - สร้าง object ด้วย properties ทั้งหมด
const user: UserProfile = {
  userId: "user-001",
  name: "John Doe",
  email: "john@example.com",
  theme: "dark",
  language: "th",
  notifications: true,
  lastLogin: new Date(),
};
await create<UserProfile>("userProfiles", user);

// READ - อ่านแล้วเห็นทุก columns
const profile = await read<UserProfile>("userProfiles", "user-001");
console.log(profile.name);           // "John Doe"
console.log(profile.theme);          // "dark"
console.log(profile.language);       // "th"

// FILTER ตาม columns
const thaiUsers = await query<UserProfile>("userProfiles", "language", "th");
const darkUsers = await where<UserProfile>(
  "userProfiles",
  (user) => user.theme === "dark"
);

// UPDATE partial - แก้ไข columns บางตัว
await patch<UserProfile>("userProfiles", "user-001", {
  theme: "light",
  lastLogin: new Date(),
});
```

---

## 🔄 Columns สามารถ:

| ได้ | ไม่ได้ |
|-------|---------|
| ✅ เพิ่ม properties ใหม่ | ❌ ลบ columns (ต้อง migrate) |
| ✅ แก้ไข properties | ❌ เปลี่ยนชื่อ columns |
| ✅ Filter/Query ตาม properties | ❌ Join tables อื่น |
| ✅ Index properties ได้ | ❌ Complex SQL queries |
| ✅ Store objects ซ้อนกัน | ❌ Relational constraints |

---

## 📊 Database Viewer แสดง "Columns" อย่างไร

### ตัวอย่าง: appState table

```
┌────────┬──────────────┬───────────────┐
│ appId  │ isFavorite   │ isInstalled   │
├────────┼──────────────┼───────────────┤
│ app-1  │ ✓            │ ✓             │
│ app-2  │ ✗            │ ✓             │
│ app-3  │ ✓            │ ✗             │
└────────┴──────────────┴───────────────┘
```

**Database Viewer ทำอะไร:**
1. ✅ แสดง columns (appId, isFavorite, isInstalled)
2. ✅ แสดง rows (แต่ละ item)
3. ✅ ค้นหา ลบ export ได้
4. ✅ ดูสวยชัดเจน เหมือน DevTools

---

## 💡 Practical Examples

### 1. Blog Post Table
```typescript
type BlogPost = {
  id: string;           // Primary key
  title: string;        // Column 1
  content: string;      // Column 2
  author: string;       // Column 3
  publishedAt: Date;    // Column 4 (indexed)
  tags: string[];       // Column 5
  views: number;        // Column 6
  featured: boolean;    // Column 7 (indexed)
};

// Schema
this.version(5).stores({
  blogPosts: "id, publishedAt, featured, tags",
});
```

### 2. E-Commerce Product Table
```typescript
type Product = {
  id: string;              // Primary key
  name: string;            // Column 1
  description: string;     // Column 2
  price: number;           // Column 3
  category: string;        // Column 4 (indexed)
  stock: number;           // Column 5
  isActive: boolean;       // Column 6 (indexed)
  createdAt: Date;         // Column 7
  images: string[];        // Column 8
};

// Schema
this.version(5).stores({
  products: "id, category, isActive, createdAt",
});
```

### 3. Chat Messages Table
```typescript
type Message = {
  id: string;              // Primary key
  roomId: string;          // Column 1 (indexed)
  senderId: string;        // Column 2 (indexed)
  text: string;            // Column 3
  timestamp: Date;         // Column 4 (indexed)
  isRead: boolean;         // Column 5
  attachments: string[];   // Column 6
};

// Schema
this.version(5).stores({
  messages: "id, roomId, senderId, timestamp, isRead",
});
```

---

## 🚀 ข้อดีของ Structured Objects

vs Traditional Key-Value:

| ประเด็น | Key-Value | Structured |
|---------|-----------|-----------|
| ค้นหา | ต้อง serialize/deserialize | Query ได้โดยตรง |
| Filter | ต้องอ่านทั้งหมดแล้ว filter | Dexie ช่วย filter |
| Indexes | ไม่มี | สามารถ index properties |
| Type Safety | ไม่มี | Full TypeScript support |
| ความชัดเจน | สับสน | ชัดเจน readable |

---

## 📖 การใช้ Database Viewer

1. เปิด DevTools → Database Viewer
2. เลือก table ใช้ **Tabs**
3. ดู **columns** แต่ละตัวเป็น column ในตาราง
4. **Search** ค้นหาข้อมูล
5. **View** ดูรายละเอียด JSON
6. **Delete/Export** จัดการข้อมูล

```
┌─────────────────────────────────────┐
│ 📊 Database Viewer                  │
├─────────────────────────────────────┤
│ [config] [appState] [userProfiles] │
├─────────────────────────────────────┤
│ Search: ________________            │
├─────────────────────────────────────┤
│ ┌────────┬──────────┬───────────┐  │
│ │ Column1│ Column2  │ Column3   │  │
│ ├────────┼──────────┼───────────┤  │
│ │ data1  │ data2    │ data3     │  │
│ │ data1  │ data2    │ data3     │  │
│ └────────┴──────────┴───────────┘  │
└─────────────────────────────────────┘
```

---

## ✨ Summary

**IndexedDB ≠ Key-Value**
- ✅ Structured Objects (ชุด properties)
- ✅ สามารถสร้าง "columns" ของเอง
- ✅ สามารถ query/filter ตาม properties
- ✅ สามารถ index multiple properties
- ✅ Database Viewer แสดงเป็น table ชัดเจน

**ต่างจาก localStorage:**
- localStorage: String only `{ key: "theme" }`
- IndexedDB: Objects `{ appId: "app-001", isFavorite: true, isInstalled: false }`

จึงใช้ได้ดี! 🚀
