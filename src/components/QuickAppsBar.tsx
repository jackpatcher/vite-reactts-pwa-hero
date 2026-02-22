import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Grid } from "flowbite-react-icons/outline";
import { CheckCircle } from "flowbite-react-icons/solid";
import { apps as appsData } from "../data/apps";
import AppIcon from "./AppIcon";
import { writeLauncherSelection } from "../lib/appStorage";
import { useToast } from "./ToastContext";
import { useFavoriteApps, useInstalledApps, useLauncherSelection } from "../modules/storage";

export default function QuickAppsBar() {
  // ใช้ useLiveQuery แทน useState - จะอัพเดทอัตโนมัติเมื่อข้อมูลเปลี่ยน
  const favorites = useFavoriteApps() ?? [];
  const installed = useInstalledApps() ?? [];
  const selectedId = useLauncherSelection();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  const { showToast } = useToast();

  const localVersion = "1.0.0"; // ปรับตรงนี้ให้ sync กับ version จริง
  const checkVersion = async () => {
    try {
      const res = await fetch("/version.json?" + Date.now());
      const data = await res.json();
      if (data.version !== localVersion) {
        showToast({
          message: `พบเวอร์ชันใหม่ ${data.version}`,
          type: "info",
        });
      } else {
        showToast({
          message: "แอปเป็นเวอร์ชันล่าสุดแล้ว",
          type: "success",
        });
      }
    } catch (e) {
      showToast({
        message: "เช็กเวอร์ชันไม่สำเร็จ",
        type: "danger",
      });
    }
  };

  if (favoriteApps.length === 0) return null;

  return (
    <div className="quick-apps-bar" ref={wrapperRef}>
      <Button
        isIconOnly
        variant="bordered"
        title="Check update"
        aria-label="Check update"
        onClick={checkVersion}
        className="quick-apps-update-btn"
        onMouseEnter={() => {
          window.dispatchEvent(
            new CustomEvent("_setTranslation", { detail: { text: "Check for app updates" } })
          );
        }}
        onMouseLeave={() => {
          window.dispatchEvent(
            new CustomEvent("_setTranslation", { detail: { text: "" } })
          );
        }}
      >
        <CheckCircle size={18} />
      </Button>
      <Button
        isIconOnly
        variant="flat"
        aria-label="Open favorite apps"
        className="quick-apps-trigger"
        onPress={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => {
          window.dispatchEvent(
            new CustomEvent("_setTranslation", { detail: { text: "Open favorite apps" } })
          );
        }}
        onMouseLeave={() => {
          window.dispatchEvent(
            new CustomEvent("_setTranslation", { detail: { text: "" } })
          );
        }}
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
                  void writeLauncherSelection(app!.id);
                  // selectedId จะอัพเดทอัตโนมัติผ่าน useLiveQuery
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
