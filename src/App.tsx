import { useEffect, useMemo, useState, type JSX } from "react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Progress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  Bell,
  Box,
  ChevronDown,
  CreditCard,
  Globe,
  LayoutGrid,
  Menu,
  Moon,
  Package,
  Receipt,
  RotateCcw,
  Search,
  ShoppingBag,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";

type ThemeMode = "light" | "dark";

type MenuItem = {
  id: string;
  label: string;
  icon: JSX.Element;
  basePath: string;
  subItems: { label: string; path: string }[];
};

type FaqItem = {
  title: string;
  content: string;
  icon: JSX.Element;
};

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutGrid size={18} />,
    basePath: "/dashboard",
    subItems: [
      { label: "Overview", path: "/dashboard/overview" },
      { label: "Insights", path: "/dashboard/insights" },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: <Package size={18} />,
    basePath: "/orders",
    subItems: [
      { label: "All Orders", path: "/orders/all" },
      { label: "Fulfillment", path: "/orders/fulfillment" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
    basePath: "/settings",
    subItems: [
      { label: "Profile", path: "/settings/profile" },
      { label: "Preferences", path: "/settings/preferences" },
    ],
  },
];

const faqItems: FaqItem[] = [
  {
    title: "How do I place an order?",
    content:
      "Browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
    icon: <ShoppingBag size={16} />,
  },
  {
    title: "Can I modify or cancel my order?",
    content:
      "Yes, you can modify or cancel your order before it's shipped. Once your order is processed, you can't make changes.",
    icon: <Receipt size={16} />,
  },
  {
    title: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, including Visa, Mastercard, and American Express.",
    icon: <CreditCard size={16} />,
  },
  {
    title: "How much does shipping cost?",
    content:
      "Shipping costs vary based on your location and the size of your order. We offer free shipping for orders over $50.",
    icon: <Box size={16} />,
  },
  {
    title: "Do you ship internationally?",
    content:
      "Yes, we ship to most countries. Please check our shipping rates and policies for more information.",
    icon: <Globe size={16} />,
  },
  {
    title: "How do I request a refund?",
    content:
      "If you're not satisfied with your purchase, you can request a refund within 30 days of purchase. Please contact our customer support team for assistance.",
    icon: <RotateCcw size={16} />,
  },
];

function useTheme(): [ThemeMode, (mode: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme-mode");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  return [mode, setMode];
}

function AppShell() {
  const [mode, setMode] = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const expandedKeys = useMemo(() => {
    const match = menuItems.find((item) =>
      location.pathname.startsWith(item.basePath)
    );
    return match ? [match.id] : [];
  }, [location.pathname]);

  return (
    <div className="app">
      <header className="appbar">
        <div className="appbar-inner">
          <div className="appbar-brand">
            <div className="brand-mark">HQ</div>
            <div className="brand-text">
              <div className="brand-title">HeroUI Admin</div>
              <div className="brand-subtitle">PWA Workspace</div>
            </div>
          </div>
          <div className="appbar-center">
            <div className="appbar-search-wrap">
              <Input
                aria-label="Search"
                placeholder="Search workspace"
                startContent={<Search size={16} />}
                variant="flat"
                size="sm"
                className="appbar-search"
              />
            </div>
          </div>
          <div className="appbar-actions">
            <Chip
              color="secondary"
              variant="flat"
              startContent={<Sparkles size={14} />}
            >
              Live demo
            </Chip>
            <Button isIconOnly variant="flat" aria-label="Alerts">
              <Bell size={18} />
            </Button>
            <Switch
              isSelected={mode === "dark"}
              onValueChange={(checked) => setMode(checked ? "dark" : "light")}
              size="sm"
              thumbIcon={({ isSelected }) =>
                isSelected ? <Moon size={14} /> : <Sun size={14} />
              }
            >
              {mode === "dark" ? "Dark" : "Light"}
            </Switch>
            <Avatar name="S" size="sm" color="primary" className="appbar-avatar" />
          </div>
        </div>
      </header>

      <div className={`layout ${isSidebarOpen ? "" : "sidebar-hidden"}`}>
        <aside className="sidebar">
          <Card className="sidebar-card">
            <CardHeader className="sidebar-header">
              <div>
                <div className="sidebar-title">Workspace</div>
                <div className="sidebar-caption">HeroUI Kit</div>
              </div>
              <div className="sidebar-actions">
                <Chip size="sm" color="primary" variant="flat">
                  v4
                </Chip>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Toggle sidebar"
                  onPress={() => setIsSidebarOpen(false)}
                >
                  <Menu size={18} />
                </Button>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="sidebar-body">
              <Accordion
                selectionMode="single"
                variant="shadow"
                className="sidebar-accordion"
                defaultExpandedKeys={expandedKeys}
              >
                {menuItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    aria-label={item.label}
                    title={
                      <div className="menu-title">
                        <span className="menu-icon">{item.icon}</span>
                        <span className="menu-label">{item.label}</span>
                      </div>
                    }
                    indicator={<ChevronDown size={16} />}
                  >
                    <div className="submenu">
                      {item.subItems.map((sub) => (
                        <Button
                          key={sub.path}
                          as={Link}
                          to={sub.path}
                          disableRipple
                          variant={
                            location.pathname === sub.path
                              ? "solid"
                              : "light"
                          }
                          color={
                            location.pathname === sub.path
                              ? "primary"
                              : "default"
                          }
                          className="submenu-button"
                          size="sm"
                        >
                          {sub.label}
                        </Button>
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardBody>
          </Card>
        </aside>

        <main className="content">
          {!isSidebarOpen && (
            <div className="sidebar-open">
              <Button
                isIconOnly
                variant="flat"
                aria-label="Open sidebar"
                onPress={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </Button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/overview" />} />
            <Route path="/dashboard/overview" element={<DashboardPage />} />
            <Route path="/dashboard/insights" element={<InsightsPage />} />
            <Route path="/orders/all" element={<OrdersPage />} />
            <Route path="/orders/fulfillment" element={<FulfillmentPage />} />
            <Route path="/settings/profile" element={<ProfilePage />} />
            <Route path="/settings/preferences" element={<PreferencesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="page-subtitle">Track KPIs across sales, users, and ops.</p>
        </div>
        <div className="page-actions">
          <Button variant="flat">Export</Button>
          <Button color="primary">Create report</Button>
        </div>
      </div>
      <div className="card-grid">
        <Card>
          <CardHeader>Active users</CardHeader>
          <CardBody>
            <div className="stat">12,480</div>
            <Progress value={68} color="success" className="stat-progress" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Revenue</CardHeader>
          <CardBody>
            <div className="stat">$94,210</div>
            <Chip color="success" variant="flat">
              +12.4% MoM
            </Chip>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Open tickets</CardHeader>
          <CardBody>
            <div className="stat">38</div>
            <Chip color="warning" variant="flat">
              6 urgent
            </Chip>
          </CardBody>
        </Card>
      </div>
      <div className="chart-grid">
        <Card className="chart-card">
          <CardHeader className="chart-header">
            <div>
              <div className="chart-title">Revenue trend</div>
              <div className="chart-subtitle">Last 30 days</div>
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
    </div>
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

function FaqAccordion() {
  return (
    <Accordion className="faq-accordion" variant="shadow">
      {faqItems.map((item) => (
        <AccordionItem
          key={item.title}
          aria-label={item.title}
          title={
            <div className="faq-title">
              <span className="faq-icon">{item.icon}</span>
              <span className="faq-label">{item.title}</span>
            </div>
          }
          indicator={<ChevronDown size={16} />}
        >
          <div className="faq-body">{item.content}</div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function InsightsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Insights</h1>
          <p className="page-subtitle">Signals from product usage and growth.</p>
        </div>
        <Button variant="flat">Download CSV</Button>
      </div>
      <div className="card-grid">
        <Card>
          <CardHeader>Weekly retention</CardHeader>
          <CardBody>
            <Progress value={74} color="primary" className="stat-progress" />
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
    </div>
  );
}

function OrdersPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">Filter, tag, and track every order.</p>
        </div>
        <Button color="primary">New order</Button>
      </div>
      <Card>
        <CardBody className="filters">
          <Input label="Search" placeholder="Order ID or customer" />
          <Input label="Status" placeholder="Processing" />
          <Input label="Assignee" placeholder="Agent name" />
          <Button variant="flat">Apply</Button>
        </CardBody>
      </Card>
      <Card className="table-card">
        <CardHeader>Order queue</CardHeader>
        <CardBody>
          <Table aria-label="Orders table" removeWrapper>
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TOTAL</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell>#14291</TableCell>
                <TableCell>Jordan Lee</TableCell>
                <TableCell>
                  <Chip color="primary" variant="flat">
                    Processing
                  </Chip>
                </TableCell>
                <TableCell>$420.00</TableCell>
              </TableRow>
              <TableRow key="2">
                <TableCell>#14290</TableCell>
                <TableCell>Amara Stein</TableCell>
                <TableCell>
                  <Chip color="success" variant="flat">
                    Shipped
                  </Chip>
                </TableCell>
                <TableCell>$96.25</TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell>#14289</TableCell>
                <TableCell>Sunny N.</TableCell>
                <TableCell>
                  <Chip color="warning" variant="flat">
                    On hold
                  </Chip>
                </TableCell>
                <TableCell>$180.75</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

function FulfillmentPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Fulfillment</h1>
          <p className="page-subtitle">Prepare shipments and manage carriers.</p>
        </div>
        <Button variant="flat">Export labels</Button>
      </div>
      <div className="card-grid">
        <Card>
          <CardHeader>Pick list</CardHeader>
          <CardBody>
            <div className="stat">24 items</div>
            <Chip color="primary" variant="flat">
              6 priority
            </Chip>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Carrier SLA</CardHeader>
          <CardBody>
            <Progress value={82} color="secondary" className="stat-progress" />
            <div className="stat-caption">On-time dispatch rate</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Warehouse load</CardHeader>
          <CardBody>
            <div className="stat">74%</div>
            <Chip color="warning" variant="flat">
              Staffing needed
            </Chip>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardHeader>Shipment checklist</CardHeader>
        <CardBody>
          <div className="checklist">
            <Chip color="success" variant="flat">
              Labels printed
            </Chip>
            <Chip color="success" variant="flat">
              QA scanned
            </Chip>
            <Chip color="warning" variant="flat">
              Pending pickup
            </Chip>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p className="page-subtitle">Keep your personal details updated.</p>
        </div>
        <Button color="primary">Save changes</Button>
      </div>
      <Card>
        <CardBody className="profile-grid">
          <Avatar name="S" size="lg" color="primary" />
          <div className="profile-fields">
            <Input label="Full name" placeholder="Somchai Tech" />
            <Input label="Email" placeholder="somchai@example.com" />
            <Input label="Role" placeholder="Product lead" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function PreferencesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Preferences</h1>
          <p className="page-subtitle">Tune notifications and workspace mode.</p>
        </div>
        <Button variant="flat">Reset</Button>
      </div>
      <Card>
        <CardBody className="preferences-grid">
          <div>
            <div className="pref-title">Notifications</div>
            <div className="pref-caption">Select channels to receive updates.</div>
          </div>
          <div className="pref-switches">
            <Switch defaultSelected>Product updates</Switch>
            <Switch defaultSelected>Weekly digest</Switch>
            <Switch>Incidents</Switch>
          </div>
        </CardBody>
      </Card>
      <Card className="faq-card">
        <CardHeader>FAQ</CardHeader>
        <CardBody>
          <FaqAccordion />
        </CardBody>
      </Card>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page">
      <Card>
        <CardBody className="notfound">
          <div>
            <h1>Page not found</h1>
            <p className="page-subtitle">Try a menu link to continue.</p>
          </div>
          <Button as={Link} to="/dashboard/overview" color="primary">
            Go to dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
