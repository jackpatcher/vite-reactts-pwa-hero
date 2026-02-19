import { Card, CardBody, CardHeader, Progress, Chip, Button } from "@heroui/react";
import PageShell from "../components/PageShell";

type SidebarToggleProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function InsightsPage({ isSidebarOpen, onToggleSidebar }: SidebarToggleProps) {
  return (
    <PageShell
      title="Insights"
      subtitle="Signals from product usage and growth."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={<Button variant="flat">Download CSV</Button>}
    >
      <div className="card-grid">
        <Card>
          <CardHeader>Weekly retention</CardHeader>
          <CardBody>
            <Progress value={74} color="primary" className="stat-progress" aria-label="Weekly retention progress" />
            <div className="stat-caption">Up from 69% last week</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Session duration</CardHeader>
          <CardBody>
            <div className="stat">6m 42s</div>
            <Chip color="secondary" variant="flat">
              +8% WoW
            </Chip>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Top feature</CardHeader>
          <CardBody>
            <div className="stat">Flow builder</div>
            <Chip color="success" variant="flat">
              2,140 activations
            </Chip>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardHeader>Key notes</CardHeader>
        <CardBody>
          <div className="note-grid">
            <Card shadow="sm">
              <CardHeader>Onboarding</CardHeader>
              <CardBody>
                Activation rate rose after the new checklist went live.
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardHeader>Payments</CardHeader>
              <CardBody>
                Card declines down 4.3% after the retry logic update.
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardHeader>Support</CardHeader>
              <CardBody>
                Average response time now under 6 minutes for chat.
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </PageShell>
  );
}
