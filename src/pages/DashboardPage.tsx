import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import PageShell from "../components/PageShell";
import { useState } from "react";
import { useToast } from "../components/ToastContext";
import { Refresh } from "flowbite-react-icons/outline";

type SidebarToggleProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function DashboardPage({
  isSidebarOpen,
  onToggleSidebar,
}: SidebarToggleProps) {
  // ...existing code...
  const [localVersion] = useState<string>("1.0.0"); // ปรับตรงนี้ให้ sync กับ version จริง
  const { showToast } = useToast();

  // ไม่เช็กอัตโนมัติทุกครั้งที่เปิดหน้า Dashboard

  const checkVersion = async () => {
    try {
      const res = await fetch("/version.json?" + Date.now());
      const data = await res.json();
      // ...existing code...
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

  return (
    <PageShell
      title="Dashboard Overview"
      subtitle="Track KPIs across sales, users, and ops."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={
        <>
          <Button variant="flat">Export</Button>
          <Button color="primary">Create report</Button>
          <Button
            isIconOnly
            variant="bordered"
            title="Check update"
            onClick={checkVersion}
            className="ml-2"
          >
            <Refresh size={22} />
          </Button>
        </>
      }
    >
      <div className="card-grid">
        <Card className="metric-card metric-card--users" isBlurred shadow="sm">
          <CardBody className="metric-media">
            <div className="metric-media-art metric-media-art--users">AU</div>
            <div className="metric-media-content">
              <div className="metric-media-title">Active users</div>
              <div className="metric-media-stat">12,480</div>
              <div className="metric-media-meta">+6.2%</div>
            </div>
            <div className="metric-donut" aria-hidden="true">
              <svg className="metric-donut-svg" viewBox="0 0 44 44">
                <circle className="metric-donut-track" cx="22" cy="22" r="18" />
                <circle
                  className="metric-donut-progress"
                  cx="22"
                  cy="22"
                  r="18"
                  pathLength="100"
                  strokeDasharray="68 100"
                />
              </svg>
              <div className="metric-donut-value">68%</div>
            </div>
          </CardBody>
        </Card>
        <Card className="metric-card metric-card--revenue" isBlurred shadow="sm">
          <CardBody className="metric-media">
            <div className="metric-media-art metric-media-art--revenue">RV</div>
            <div className="metric-media-content">
              <div className="metric-media-title">Revenue</div>
              <div className="metric-media-stat">$94,210</div>
              <div className="metric-media-meta">+12.4%</div>
            </div>
            <div className="metric-donut" aria-hidden="true">
              <svg className="metric-donut-svg" viewBox="0 0 44 44">
                <circle className="metric-donut-track" cx="22" cy="22" r="18" />
                <circle
                  className="metric-donut-progress"
                  cx="22"
                  cy="22"
                  r="18"
                  pathLength="100"
                  strokeDasharray="74 100"
                />
              </svg>
              <div className="metric-donut-value">74%</div>
            </div>
          </CardBody>
        </Card>
        <Card className="metric-card metric-card--tickets" isBlurred shadow="sm">
          <CardBody className="metric-media">
            <div className="metric-media-art metric-media-art--tickets">OT</div>
            <div className="metric-media-content">
              <div className="metric-media-title">Open tickets</div>
              <div className="metric-media-stat">38</div>
              <div className="metric-media-meta">6 urgent</div>
            </div>
            <div className="metric-donut" aria-hidden="true">
              <svg className="metric-donut-svg" viewBox="0 0 44 44">
                <circle className="metric-donut-track" cx="22" cy="22" r="18" />
                <circle
                  className="metric-donut-progress"
                  cx="22"
                  cy="22"
                  r="18"
                  pathLength="100"
                  strokeDasharray="42 100"
                />
              </svg>
              <div className="metric-donut-value">42%</div>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="chart-grid">
        <Card className="chart-card">
          <CardHeader className="chart-header">
            <div>
              <div className="chart-title">Revenue trend</div>
            </div>
            <Chip color="secondary" variant="flat">
              +9.2%
            </Chip>
          </CardHeader>
          <CardBody>
            <RevenueChart />
            <div className="chart-footer">
              <div>
                <div className="chart-label">Average order value</div>
                <div className="chart-value">$182</div>
              </div>
              <div>
                <div className="chart-label">Conversion</div>
                <div className="chart-value">3.6%</div>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="chart-card">
          <CardHeader className="chart-header">
            <div>
              <div className="chart-title">Traffic split</div>
              <div className="chart-subtitle">By channel</div>
            </div>
            <Chip color="primary" variant="flat">
              61k visits
            </Chip>
          </CardHeader>
          <CardBody className="donut-card">
            <TrafficDonut />
            <div className="donut-legend">
              <div className="legend-item">
                <span className="legend-dot brand" />Brand
              </div>
              <div className="legend-item">
                <span className="legend-dot paid" />Paid
              </div>
              <div className="legend-item">
                <span className="legend-dot social" />Social
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Card className="table-card">
        <CardHeader>Recent activity</CardHeader>
        <CardBody>
          <Table aria-label="Recent activity table" removeWrapper>
            <TableHeader>
              <TableColumn>CHANNEL</TableColumn>
              <TableColumn>OWNER</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>UPDATED</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>Web checkout</TableCell>
                <TableCell>Mira</TableCell>
                <TableCell>
                  <Chip color="success" variant="flat">
                    Live
                  </Chip>
                </TableCell>
                <TableCell>2m ago</TableCell>
              </TableRow>
              <TableRow key="2">
                <TableCell>Mobile app</TableCell>
                <TableCell>Ken</TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat">
                    Deploying
                  </Chip>
                </TableCell>
                <TableCell>12m ago</TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell>Partner API</TableCell>
                <TableCell>Aria</TableCell>
                <TableCell>
                  <Chip color="warning" variant="flat">
                    Review
                  </Chip>
                </TableCell>
                <TableCell>1h ago</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </PageShell>
  );
}

function RevenueChart() {
  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 300 120" className="chart-svg" role="img">
        <defs>
          <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="url(#revenueFill)"
          stroke="none"
          points="0,100 30,86 60,92 90,70 120,78 150,60 180,66 210,50 240,58 270,40 300,48 300,120 0,120"
        />
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points="0,100 30,86 60,92 90,70 120,78 150,60 180,66 210,50 240,58 270,40 300,48"
        />
        <g className="chart-dots">
          {[
            [30, 86],
            [90, 70],
            [150, 60],
            [210, 50],
            [270, 40],
          ].map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="4" />
          ))}
        </g>
      </svg>
    </div>
  );
}

function TrafficDonut() {
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 120 120" className="donut-svg" role="img">
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="#2563eb"
          strokeWidth="12"
          fill="none"
          strokeDasharray="138 276"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="#0ea5e9"
          strokeWidth="12"
          fill="none"
          strokeDasharray="78 276"
          strokeLinecap="round"
          transform="rotate(40 60 60)"
        />
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="#22c55e"
          strokeWidth="12"
          fill="none"
          strokeDasharray="60 276"
          strokeLinecap="round"
          transform="rotate(150 60 60)"
        />
        <text x="60" y="56" textAnchor="middle" className="donut-value">
          61k
        </text>
        <text x="60" y="72" textAnchor="middle" className="donut-label">
          Visits
        </text>
      </svg>
    </div>
  );
}
