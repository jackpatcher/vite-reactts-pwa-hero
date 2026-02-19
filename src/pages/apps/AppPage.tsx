import { Navigate, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Chip, Input, Progress, Switch } from "@heroui/react";
import { apps as appsData } from "../../data/apps";
import { renderAppContent } from "./AppRouteRegistry";

export default function AppPage() {
  const { appId, page } = useParams();
  const app = appsData.find((a) => a.id === appId);
  if (!app) return <Navigate to="/apps" />;
  const tabPages = app.pages.slice(0, 3);
  const pageDef = app.pages.find((p) => p.path === page);
  const pageIndex = pageDef ? app.pages.findIndex((p) => p.id === pageDef.id) : -1;

  if (!page || !pageDef) {
    const fallback = tabPages[0];
    return fallback ? <Navigate to={`/apps/${app.id}/${fallback.path}`} /> : <Navigate to="/apps" />;
  }

  return (
    <div className="app-page">

      {/* App-specific renderer (from registry) */}
      {renderAppContent({ app, pageDef }) ?? (pageIndex === 0 ? (
        <div className="app-page-grid">
          <Card className="app-page-card">
            <CardHeader>Today</CardHeader>
            <CardBody>
              <div className="app-stat">1,248</div>
              <div className="app-muted">Active items</div>
              <Progress value={64} className="app-progress" aria-label="Active items progress" />
            </CardBody>
          </Card>
          <Card className="app-page-card">
            <CardHeader>Quick actions</CardHeader>
            <CardBody className="app-actions">
              <Button variant="flat">Create</Button>
              <Button variant="flat">Import</Button>
              <Button variant="flat">Share</Button>
            </CardBody>
          </Card>
          <Card className="app-page-card">
            <CardHeader>Recent activity</CardHeader>
            <CardBody className="app-activity">
              {[
                "Synced new records",
                "Updated pricing rules",
                "Scheduled nightly report",
              ].map((item) => (
                <div key={item} className="app-activity-item">
                  <Chip size="sm" variant="flat" color="primary">Live</Chip>
                  <span>{item}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      ) : null) }

      {pageIndex === 1 ? (
        <div className="app-page-grid app-page-grid--two">
          <Card className="app-page-card">
            <CardHeader>Pipeline</CardHeader>
            <CardBody className="app-list">
              {[
                { label: "Draft", value: 24 },
                { label: "Review", value: 12 },
                { label: "Ready", value: 8 },
              ].map((row) => (
                <div key={row.label} className="app-list-row">
                  <span>{row.label}</span>
                  <Chip size="sm" variant="flat">{row.value}</Chip>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card className="app-page-card">
            <CardHeader>Highlights</CardHeader>
            <CardBody>
              <div className="app-highlight">
                <div className="app-highlight-title">Weekly growth</div>
                <div className="app-stat">+18.2%</div>
              </div>
              <div className="app-highlight">
                <div className="app-highlight-title">Conversion</div>
                <div className="app-stat">3.6%</div>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : null}

      {pageIndex === 2 ? (
        <Card className="app-page-card app-settings-card">
          <CardHeader>Settings</CardHeader>
          <CardBody className="app-settings">
            <Input label="Workspace name" placeholder={`${app.name} Workspace`} />
            <Input label="Default owner" placeholder="Assign owner" />
            <Switch defaultSelected>Enable notifications</Switch>
            <Button color="primary">Save changes</Button>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
