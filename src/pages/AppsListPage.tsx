import React, { useMemo, useState } from "react";
import { apps as appsData, type AppDef } from "../data/apps";
import AppCard from "../components/AppCard";
import PageShell from "../components/PageShell";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/react";
import {
  readFavorites,
  readInstalled,
  writeFavorites,
  writeInstalled,
} from "../lib/appStorage";

export default function AppsListPage({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen: boolean; onToggleSidebar: () => void }) {
  const [favorites, setFavorites] = useState<string[]>(readFavorites());
  const [installed, setInstalled] = useState<string[]>(readInstalled());
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function toggleFavorite(id: string) {
    if (!installed.includes(id)) return;
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      writeFavorites(next);
      const dispatch = () =>
        window.dispatchEvent(new CustomEvent("favorites:updated", { detail: { favorites: next } }));
      if (typeof queueMicrotask === "function") {
        queueMicrotask(dispatch);
      } else {
        setTimeout(dispatch, 0);
      }
      return next;
    });
  }

  function toggleInstall(id: string) {
    setInstalled((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      writeInstalled(next);
      const dispatch = () =>
        window.dispatchEvent(new CustomEvent("installed:updated", { detail: { installed: next } }));
      if (typeof queueMicrotask === "function") {
        queueMicrotask(dispatch);
      } else {
        setTimeout(dispatch, 0);
      }
      if (!next.includes(id)) {
        setFavorites((prevFavorites) => {
          const nextFavorites = prevFavorites.filter((x) => x !== id);
          if (nextFavorites.length !== prevFavorites.length) {
            writeFavorites(nextFavorites);
            const dispatch = () =>
              window.dispatchEvent(new CustomEvent("favorites:updated", { detail: { favorites: nextFavorites } }));
            if (typeof queueMicrotask === "function") {
              queueMicrotask(dispatch);
            } else {
              setTimeout(dispatch, 0);
            }
          }
          return nextFavorites;
        });
      }
      return next;
    });
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

  const installedApps = filteredApps.filter((app) => installed.includes(app.id));
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
            installedApps.map((app: AppDef) => (
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
                onOpen={() => navigate(`/apps/${app.id}/${app.pages[0].path}`)}
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
