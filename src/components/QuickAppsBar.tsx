import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Grid } from "flowbite-react-icons/outline";
import { apps as appsData } from "../data/apps";
import AppIcon from "./AppIcon";
import {
  readFavorites,
  readInstalled,
  readLauncherSelection,
  writeFavorites,
  writeLauncherSelection,
} from "../lib/appStorage";

export default function QuickAppsBar() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [installed, setInstalled] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setFavorites(readFavorites());
    setSelectedId(readLauncherSelection());
    setInstalled(readInstalled());
  }, []);

  useEffect(() => {
    function handleFavoritesUpdated(event: Event) {
      const detail = (event as CustomEvent<{ favorites?: string[] }>).detail;
      if (detail?.favorites) {
        setFavorites(detail.favorites);
      } else {
        setFavorites(readFavorites());
      }
    }

    window.addEventListener("favorites:updated", handleFavoritesUpdated);
    window.addEventListener("storage", handleFavoritesUpdated);
    return () => {
      window.removeEventListener("favorites:updated", handleFavoritesUpdated);
      window.removeEventListener("storage", handleFavoritesUpdated);
    };
  }, []);

  useEffect(() => {
    function handleInstalledUpdated(event: Event) {
      const detail = (event as CustomEvent<{ installed?: string[] }>).detail;
      if (detail?.installed) {
        setInstalled(detail.installed);
      } else {
        setInstalled(readInstalled());
      }
    }

    window.addEventListener("installed:updated", handleInstalledUpdated);
    window.addEventListener("storage", handleInstalledUpdated);
    return () => {
      window.removeEventListener("installed:updated", handleInstalledUpdated);
      window.removeEventListener("storage", handleInstalledUpdated);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const favoriteApps = useMemo(
    () =>
      favorites
        .filter((id) => installed.includes(id))
        .map((id) => appsData.find((a) => a.id === id))
        .filter(Boolean),
    [favorites, installed]
  );

  useEffect(() => {
    const filtered = favorites.filter((id) => installed.includes(id));
    if (filtered.length !== favorites.length) {
      writeFavorites(filtered);
      setFavorites(filtered);
      const dispatch = () =>
        window.dispatchEvent(new CustomEvent("favorites:updated", { detail: { favorites: filtered } }));
      if (typeof queueMicrotask === "function") {
        queueMicrotask(dispatch);
      } else {
        setTimeout(dispatch, 0);
      }
    }
  }, [favorites, installed]);

  useEffect(() => {
    if (!selectedId) return;
    const exists = favoriteApps.some((app) => app?.id === selectedId);
    if (!exists) {
      setSelectedId(null);
      writeLauncherSelection(null);
    }
  }, [favoriteApps, selectedId]);

  if (favoriteApps.length === 0) return null;

  return (
    <div className="quick-apps-bar" ref={wrapperRef}>
      <Button
        isIconOnly
        variant="flat"
        aria-label="Open favorite apps"
        className="quick-apps-trigger"
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <span className="quick-apps-trigger-icon" aria-hidden="true">
          <Grid size={18} />
        </span>
        <span className="quick-apps-badge">{favoriteApps.length}</span>
      </Button>
      {isOpen ? (
        <div className="quick-apps-menu" role="menu">
          {favoriteApps.map((app) => {
            const to = `/apps/${app!.id}/${app!.pages[0].path}`;
            return (
              <Link
                key={app!.id}
                to={to}
                className={`quick-apps-item${selectedId === app!.id ? " is-active" : ""}`}
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedId(app!.id);
                  writeLauncherSelection(app!.id);
                }}
              >
                <span className="quick-apps-item-avatar app-icon" aria-hidden="true">
                  <AppIcon appId={app!.id} color={app!.color} size={18} />
                </span>
                <span className="quick-apps-item-label">{app!.name}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
