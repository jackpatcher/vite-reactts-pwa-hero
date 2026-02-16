// ตัวอย่างการใช้ useLiveQuery จาก Dexie

import { useFavoriteApps, useInstalledApps, useLauncherSelection } from "../modules/storage";

// ตัวอย่าง Component ที่ใช้ useLiveQuery
export function ExampleComponent() {
  // อ่านข้อมูลแบบ reactive - จะอัพเดทอัตโนมัติเมื่อข้อมูลเปลี่ยน
  const favorites = (useFavoriteApps() ?? []) as string[];
  const installed = (useInstalledApps() ?? []) as string[];
  const selectedId = useLauncherSelection();

  // ข้อมูลจะอัพเดทอัตโนมัติ ไม่ต้องใช้ useEffect หรือ event listeners

  return (
    <div>
      <h2>Favorites: {favorites.length}</h2>
      <h2>Installed: {installed.length}</h2>
      <h2>Selected: {selectedId ?? "none"}</h2>
    </div>
  );
}

/* 
การใช้งาน useLiveQuery มีข้อดีคือ:

1. ✅ อัพเดทอัตโนมัติเมื่อข้อมูลใน DB เปลี่ยน
2. ✅ ไม่ต้องใช้ event listeners
3. ✅ ไม่ต้องใช้ useState + useEffect
4. ✅ Component ทุกตัวที่ใช้ hook เดียวกันจะซิงค์กันอัตโนมัติ
5. ✅ รองรับ multiple tabs/windows

แทนที่:
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    void readFavorites().then(setFavorites);
  }, []);

ด้วย:
  const favorites = useFavoriteApps() ?? [];

*/

// ตัวอย่างการใช้ใน QuickAppsBar (แบบย่อ)
export function QuickAppsBarExample() {
  const favorites = (useFavoriteApps() ?? []) as string[];
  const installed = (useInstalledApps() ?? []) as string[];
  
  // Filter favorite apps that are installed
  const favoriteApps = favorites
    .filter((id) => installed.includes(id))
    .map((id) => apps.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div>
      {favoriteApps.map((app) => (
        <div key={app.id}>{app.name}</div>
      ))}
    </div>
  );
}

// ตัวอย่างการใช้ theme
import { useTheme } from "../modules/storage";
import { writeTheme } from "../lib/appStorage";

export function ThemeToggleExample() {
  const theme = useTheme();
  const mode = theme?.mode ?? "light";

  const toggleMode = async () => {
    await writeTheme({
      ...theme,
      mode: mode === "dark" ? "light" : "dark",
    });
    // Component จะอัพเดทอัตโนมัติ
  };

  return <button onClick={toggleMode}>Mode: {mode}</button>;
}

// Placeholder for apps import
const apps: any[] = [];
