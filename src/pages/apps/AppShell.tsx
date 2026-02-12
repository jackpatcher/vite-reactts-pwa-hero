import { Link, Outlet, useLocation, useParams, Navigate } from "react-router-dom";
import { apps as appsData } from "../../data/apps";
import PageShell from "../../components/PageShell";

export default function AppShell({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { appId } = useParams();
  const location = useLocation();
  const app = appsData.find((a) => a.id === appId);
  if (!app) return <Navigate to="/apps" />;
  const tabPages = app.pages.slice(0, 3);

  return (
    <PageShell title={app.name} subtitle={`${app.name} • Mini app`} isSidebarOpen={isSidebarOpen} onToggleSidebar={onToggleSidebar}>
      <nav className="app-shell-tabs">
        {tabPages.map((p) => {
          const to = `/apps/${app.id}/${p.path}`;
          const isActive = location.pathname === to;
          return (
            <Link key={p.id} to={to} className={`app-shell-tab${isActive ? " is-active" : ""}`}>
            {p.label}
          </Link>
          );
        })}
      </nav>
      <div className="app-shell-content">
        <Outlet />
      </div>
    </PageShell>
  );
}
