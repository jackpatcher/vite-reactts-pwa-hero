import { useMemo, useState } from "react";
import { apps as appsData, type AppDef } from "../data/apps";
import AppCard from "../components/AppCard";
import PageShell from "../components/PageShell";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/react";
import { writeFavorites } from "../lib/appStorage";
import { db, setInstalled, getAppState } from "../modules/storage/indexedDb";
import { useLiveQuery } from "dexie-react-hooks";

export default function AppsListPage({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen: boolean; onToggleSidebar: () => void }) {
  // ใช้ useLiveQuery - อัพเดทอัตโนมัติเมื่อข้อมูลใน DB เปลี่ยน
  // รองรับทั้ง boolean และ 0/1 (number)
  const allAppStates = useLiveQuery(() => db.appState.toArray(), [] )?.map(s => ({
    ...s,
    isInstalled: s.isInstalled === true || s.isInstalled === 1,
    isFavorite: s.isFavorite === true || s.isFavorite === 1,
  })) ?? [];
  const installed = allAppStates.filter(s => s.isInstalled).map(s => s.appId);
  const favorites = allAppStates.filter(s => s.isFavorite).map(s => s.appId);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  async function toggleFavorite(id: string) {
    if (!installed.includes(id)) return;
    const next = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [id, ...favorites];
    await writeFavorites(next);
    // UI จะอัพเดทอัตโนมัติผ่าน useLiveQuery
  }

  async function toggleInstall(id: string) {
    const isCurrentlyInstalled = installed.includes(id);
    await setInstalled(id, !isCurrentlyInstalled);
    // ตรวจสอบค่าจริงใน db หลัง uninstall/install
    const state = await getAppState(id);
    // eslint-disable-next-line no-console
    console.log('DEBUG: AppState after setInstalled', id, state);
    // UI จะอัพเดทอัตโนมัติผ่าน useLiveQuery
  }

  const filteredApps = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return appsData;
    return appsData.filter((app) => {
      return (
        app.name.toLowerCase().includes(query) ||
        (app.description ?? "").toLowerCase().includes(query)
      );
    });
  }, [search]);

  // Find all installed app states (even if not in appsData)
  const installedAppStates = allAppStates.filter((s) => s.isInstalled);

  // Merge: for each installed app, use data from appsData if exists, else fallback to appState
  const installedApps = installedAppStates.map((state) => {
    const app = appsData.find((a) => a.id === state.appId);
    return app
      ? { ...app, isFavorite: state.isFavorite, isInstalled: true }
      : {
          id: state.appId,
          name: state.appId,
          description: "",
          details: "",
          color: undefined,
          logo: undefined,
          pages: [],
          isFavorite: state.isFavorite,
          isInstalled: true,
        };
  });

  // Available = apps in appsData that are not installed
  const availableApps = filteredApps.filter((app) => !installed.includes(app.id));

  return (
    <PageShell title="Apps" subtitle="Manage installed apps" isSidebarOpen={isSidebarOpen} onToggleSidebar={onToggleSidebar}>
      <div className="apps-toolbar">
        <Input
          aria-label="Search apps"
          placeholder="Search apps"
          value={search}
          onValueChange={setSearch}
          variant="flat"
          size="sm"
          className="apps-search"
        />
      </div>

      <section className="apps-section">
        <h3 className="apps-section-title">Installed</h3>
        <div className="apps-grid">
          {installedApps.length === 0 ? (
            <div className="apps-empty">No installed apps.</div>
          ) : (
            installedApps.map((app: any) => (
              <AppCard
                key={app.id}
                id={app.id}
                name={app.name}
                description={app.description}
                details={app.details}
                color={app.color}
                isFavorite={favorites.includes(app.id)}
                isInstalled={true}
                onToggleFavorite={toggleFavorite}
                onToggleInstall={toggleInstall}
                onOpen={app.pages && app.pages.length > 0 ? () => navigate(`/apps/${app.id}/${app.pages[0].path}`) : undefined}
                pages={app.pages}
              />
            ))
          )}
        </div>
      </section>

      <section className="apps-section">
        <h3 className="apps-section-title">Available</h3>
        <div className="apps-grid">
          {availableApps.length === 0 ? (
            <div className="apps-empty">No apps found.</div>
          ) : (
            availableApps.map((app: AppDef) => (
              <AppCard
                key={app.id}
                id={app.id}
                name={app.name}
                description={app.description}
                details={app.details}
                color={app.color}
                isFavorite={favorites.includes(app.id)}
                isInstalled={false}
                onToggleFavorite={toggleFavorite}
                onToggleInstall={toggleInstall}
                pages={app.pages}
              />
            ))
          )}
        </div>
      </section>
    </PageShell>
  );
}
