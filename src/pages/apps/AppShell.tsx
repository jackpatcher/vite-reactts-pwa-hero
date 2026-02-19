import { Link, Outlet, useLocation, useParams, Navigate } from "react-router-dom";
import { apps as appsData } from "../../data/apps";
import PageShell from "../../components/PageShell";
import AppIcon from "../../components/AppIcon";
import { useTranslationBar } from "../../contexts/TranslationContext";

export default function AppShell({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { appId } = useParams();
  const location = useLocation();
  const app = appsData.find((a) => a.id === appId);
  if (!app) return <Navigate to="/apps" />;
  const tabPages = app.pages.slice(0, 3);

  const { setText } = useTranslationBar();

  return (
    <PageShell
      title={app.name}
      subtitle={`${app.name} • Mini app`}
      icon={<AppIcon appId={app.id} size={28} />}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
    >
      {app.id !== "sarabun" && (
        <nav className="app-shell-tabs">
          {tabPages.map((p) => {
            const to = `/apps/${app.id}/${p.path}`;
            const isActive = location.pathname === to;
            return (
              <Link
                key={p.id}
                to={to}
                className={`app-shell-tab${isActive ? " is-active" : ""}`}
                aria-label={p.labelEn || p.label}
                onMouseEnter={() => setText(p.labelEn || p.label)}
                onMouseLeave={() => setText("")}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>
      )}
      <div className="app-shell-content">
        <Outlet />
      </div>
    </PageShell>
  );
}
