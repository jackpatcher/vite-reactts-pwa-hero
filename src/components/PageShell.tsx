import type { JSX, ReactNode } from "react";
import { Button } from "@heroui/react";
import { Menu } from "lucide-react";

type SidebarToggleProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

type PageHeaderProps = SidebarToggleProps & {
  title: string;
  subtitle?: string;
  actions?: JSX.Element;
  icon?: JSX.Element;
};

type PageShellProps = PageHeaderProps & {
  children: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  actions,
  isSidebarOpen,
  onToggleSidebar,
  icon,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-main">
        <Button
          isIconOnly
          variant={isSidebarOpen ? "light" : "flat"}
          aria-label="Toggle sidebar"
          onPress={onToggleSidebar}
          className="page-header-toggle"
        >
          <Menu size={18} />
        </Button>
        {icon ? <div className="page-header-icon mr-3">{icon}</div> : null}
        <div>
          <h1>{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}

export default function PageShell({ children, ...headerProps }: PageShellProps) {
  return (
    <div className="page-shell">
      <PageHeader {...(headerProps as PageHeaderProps)} />
      <div className="page">{children}</div>
    </div>
  );
}
