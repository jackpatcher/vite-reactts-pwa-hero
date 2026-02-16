# useLiveQuery - Reactive Database Queries

## การติดตั้ง

```bash
npm install dexie-react-hooks
```

## การใช้งาน

### Hooks ที่มีให้ใช้

```typescript
import {
  useTheme,
  useFavoriteApps,
  useInstalledApps,
  useLauncherSelection,
  useOnboarding,
  useIsFirstTime,
} from "../modules/storage";
```

### ตัวอย่างการใช้งาน

#### อ่านข้อมูล

```tsx
function MyComponent() {
  // ข้อมูลจะอัพเดทอัตโนมัติเมื่อมีการเปลี่ยนแปลงใน DB
  const favorites = useFavoriteApps() ?? [];
  const installed = useInstalledApps() ?? [];
  const theme = useTheme();

  return (
    <div>
      <p>Favorites: {favorites.length}</p>
      <p>Installed: {installed.length}</p>
      <p>Mode: {theme?.mode ?? "light"}</p>
    </div>
  );
}
```

#### เขียนข้อมูล

```tsx
import { writeFavorites, writeTheme } from "../lib/appStorage";

function MyComponent() {
  const favorites = useFavoriteApps() ?? [];

  const addFavorite = async (appId: string) => {
    await writeFavorites([...favorites, appId]);
    // Component จะอัพเดทอัตโนมัติหลังจาก write เสร็จ
  };

  const toggleTheme = async () => {
    const theme = useTheme();
    await writeTheme({
      ...theme,
      mode: theme?.mode === "dark" ? "light" : "dark",
    });
    // UI จะเปลี่ยนทันทีโดยอัตโนมัติ
  };

  return <div>...</div>;
}
```

## ข้อดี

✅ **อัพเดทอัตโนมัติ** - ไม่ต้องใช้ `useEffect` หรือ event listeners  
✅ **Reactive** - Component ทุกตัวที่ใช้ hook เดียวกันจะซิงค์กันอัตโนมัติ  
✅ **Multi-tab support** - ข้อมูลซิงค์ระหว่าง tabs/windows  
✅ **ง่ายกว่า** - โค้ดสั้นลงและอ่านง่ายขึ้น  
✅ **Performance** - Dexie จัดการ caching และ re-render ให้อัตโนมัติ

## เปรียบเทียบ

### แบบเก่า (useState + useEffect)

```tsx
function OldWay() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    void readFavorites().then(setFavorites);
  }, []);

  useEffect(() => {
    function handleUpdate(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (detail?.favorites) {
        setFavorites(detail.favorites);
      }
    }

    window.addEventListener("favorites:updated", handleUpdate);
    return () => window.removeEventListener("favorites:updated", handleUpdate);
  }, []);

  return <div>{favorites.length}</div>;
}
```

### แบบใหม่ (useLiveQuery)

```tsx
function NewWay() {
  const favorites = useFavoriteApps() ?? [];
  return <div>{favorites.length}</div>;
}
```

## Links

- [Dexie.js Documentation](https://dexie.org/)
- [useLiveQuery API](https://dexie.org/docs/dexie-react-hooks/useLiveQuery())
