import React from "react";
import { apps as appsData } from "../../../data/apps";
import SarabunOverview from "./tab_overview";
import SarabunOfficer from "./tab_officer";
import SarabunAdmin from "./tab_admin";
import SarabunReports from "./tab_reports";
 
import { useNavigate, useParams } from "react-router-dom";
import { useTranslationBar } from "../../../contexts/TranslationContext";

type RenderArgs = {
  pageDef?: { id: string; label: string; path: string } | undefined;
  pageIndex?: number;
};

export function renderSarabunContent({ pageDef }: RenderArgs): React.ReactNode | null {
  if (!pageDef) return null;
  if (pageDef.path === "overview") return <SarabunOverview />;
  if (pageDef.path === "admin") return <SarabunAdmin />;
  if (pageDef.path === "officer") return <SarabunOfficer />;
  if (pageDef.path === "reports") return <SarabunReports />;
 
  return null;
}

// Centralized tab definitions for the Sarabun app.
export function getSarabunTabs(appId?: string) {
  const app = appsData.find((a) => a.id === (appId || "sarabun"));
    return app ? app.pages : [
      { id: "overview", label: "ภาพรวม", path: "overview" },
      { id: "admin", label: "ผู้บริหาร", path: "admin" },
      { id: "officer", label: "เจ้าหน้าที่", path: "officer" },
      { id: "reports", label: "รายงาน", path: "reports" },
 
    ];
}

// Move TabsHeader here so per-app code is colocated with the app route.
export function TabsHeader() {
  const navigate = useNavigate();
  const { appId, page } = useParams();
  const active = page || "overview";

  const currentAppId = appId || 'sarabun'
  const tabs = getSarabunTabs(appId).filter((t) => {
    // hide settings tab for Sarabun in the header
    if (currentAppId === 'sarabun' && (t.path === 'settings' || t.id === 'settings')) return false
    return true
  })

  const { setText } = useTranslationBar();

  return (
    <div className="mb-4">
      <div className="inline-flex items-center bg-gray-100 rounded-full p-1 shadow-sm">
        {tabs.map((t) => {
          const key = (t as any).path || (t as any).id || t.id;
          const label = (t as any).label || (t as any).labelEn || t.id;
          const labelEn = (t as any).labelEn;
          const isActive = key === active;
          const btnBase = "px-4 py-1 rounded-full text-sm font-medium transition-all";
          const cls = isActive
            ? `${btnBase} bg-white text-blue-700 shadow`
            : `${btnBase} bg-transparent text-gray-600 hover:text-gray-800`;
          return (
            <button
              key={key}
              aria-pressed={isActive}
              aria-label={labelEn || label}
              className={cls}
              onClick={() => navigate(`/apps/${appId || "sarabun"}/${key}`)}
              onMouseEnter={() => setText(labelEn || label)}
              onMouseLeave={() => setText("")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default renderSarabunContent;
