import { useEffect, useMemo, useRef, useState, type JSX, type ReactNode } from "react";
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
 
  Box,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Globe,
  LayoutGrid,
  Menu,
  Moon,
  Package,
  Receipt,
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  Wrench,
} from "lucide-react";
import {
  HashRouter as BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ThemeSettingsPage from "./pages/ThemeSettingsPage";
import QuickAppsBar from "./components/QuickAppsBar";
import AppsListPage from "./pages/AppsListPage";
import MiniAppShell from "./pages/apps/AppShell";
import AppPage from "./pages/apps/AppPage";
import DevToolsPage from "./pages/DevToolsPage";
import { apps } from "./data/apps";
import { TranslationProvider } from "./contexts/TranslationContext";
import TranslationBar from "./components/TranslationBar";
import { writeTheme, readFirstTimeSetup, writeFirstTimeSetup } from "./lib/appStorage";
import { FirstimeSetupFlow } from "./modules/firsttimeSetup";
import {
  useInstalledApps,
  useIsFirstTime,
  useTheme as useThemeStorage,
} from "./modules/storage";
import "./App.css";
import { ToastProvider } from "./components/ToastContext";

type ThemeMode = "light" | "dark";

type ThemePaletteId =
  | "ocean"
  | "mint"
  | "sunset"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "indigo"
  | "slate"
  | "lime"
  | "coral"
  | "plum";

type ThemePalette = {
  id: ThemePaletteId;
  label: string;
  accent: string;
  accent2: string;
};

type ThemeFontId = "space" | "sarabun";

type ThemeFont = {
  id: ThemeFontId;
  label: string;
  value: string;
};

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

type SidebarToggleProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

type PageHeaderProps = SidebarToggleProps & {
  title: string;
  subtitle?: string;
  actions?: JSX.Element;
};

type PageShellProps = PageHeaderProps & {
  children: ReactNode;
};

type ThemeController = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => void;
  paletteId: ThemePaletteId;
  setPaletteId: (id: ThemePaletteId) => void;
  fontId: ThemeFontId;
  setFontId: (id: ThemeFontId) => void;
};

const baseMenuItems: MenuItem[] = [
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
      { label: "Theme", path: "/settings/theme" },
    ],
  },
  {
    id: "devtools",
    label: "DevTools",
    icon: <Wrench size={18} />,
    basePath: "/devtools",
    subItems: [
      { label: "Database Viewer", path: "/devtools" },
    ],
  },
];

const themePalettes: ThemePalette[] = [
  {
    id: "ocean",
    label: "Ocean",
    accent: "#2563eb",
    accent2: "#0ea5e9",
  },
  {
    id: "mint",
    label: "Mint",
    accent: "#0f766e",
    accent2: "#22d3ee",
  },
  {
    id: "sunset",
    label: "Sunset",
    accent: "#f97316",
    accent2: "#f43f5e",
  },
  {
    id: "violet",
    label: "Violet",
    accent: "#7c3aed",
    accent2: "#ec4899",
  },
  {
    id: "emerald",
    label: "Emerald",
    accent: "#10b981",
    accent2: "#34d399",
  },
  {
    id: "amber",
    label: "Amber",
    accent: "#f59e0b",
    accent2: "#fbbf24",
  },
  {
    id: "rose",
    label: "Rose",
    accent: "#f43f5e",
    accent2: "#fb7185",
  },
  {
    id: "indigo",
    label: "Indigo",
    accent: "#4f46e5",
    accent2: "#818cf8",
  },
  {
    id: "slate",
    label: "Slate",
    accent: "#334155",
    accent2: "#64748b",
  },
  {
    id: "lime",
    label: "Lime",
    accent: "#65a30d",
    accent2: "#a3e635",
  },
  {
    id: "coral",
    label: "Coral",
    accent: "#fb7185",
    accent2: "#f97316",
  },
  {
    id: "plum",
    label: "Plum",
    accent: "#9333ea",
    accent2: "#c084fc",
  },
];

const themeFonts: ThemeFont[] = [
  {
    id: "space",
    label: "Space Grotesk",
    value: '"Space Grotesk", "Segoe UI", system-ui, sans-serif',
  },
  {
    id: "sarabun",
    label: "Sarabun",
    value: '"Sarabun", "Segoe UI", system-ui, sans-serif',
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

function useTheme(): ThemeController {
  // ใช้ useLiveQuery เพื่ออ่านข้อมูล theme แบบ reactive
  const storedTheme = useThemeStorage();
  const [mode, setMode] = useState<ThemeMode>("light");
  const [paletteId, setPaletteId] = useState<ThemePaletteId>("ocean");
  const [fontId, setFontId] = useState<ThemeFontId>("space");
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync stored theme to local state
  useEffect(() => {
    if (storedTheme) {
      setMode(storedTheme.mode === "dark" ? "dark" : "light");

      const palette = themePalettes.find(
        (item) => item.id === storedTheme.paletteId
      );
      if (palette) {
        setPaletteId(palette.id);
      }

      const font = themeFonts.find((item) => item.id === storedTheme.fontId);
      if (font) {
        setFontId(font.id);
      }
    }
    setIsHydrated(true);
  }, [storedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  useEffect(() => {
    const palette = themePalettes.find((item) => item.id === paletteId);
    if (!palette) {
      return;
    }
    const root = document.documentElement;
    root.style.setProperty("--app-accent", palette.accent);
    root.style.setProperty("--app-accent-2", palette.accent2);
  }, [paletteId]);

  useEffect(() => {
    const font = themeFonts.find((item) => item.id === fontId);
    if (!font) {
      return;
    }
    const root = document.documentElement;
    root.style.setProperty("--app-font", font.value);
  }, [fontId]);

  useEffect(() => {
    if (!isHydrated) return;
    void writeTheme({ mode, paletteId, fontId });
  }, [mode, paletteId, fontId, isHydrated]);

  return {
    mode,
    setMode,
    paletteId,
    setPaletteId,
    fontId,
    setFontId,
  };
}

function AppShell() {
    // Hotkey: Ctrl+Shift+E => toggle isFirstTimeSetupDone
    useEffect(() => {
      const handler = async (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
          e.preventDefault();
          const setup = await readFirstTimeSetup();
          let newValue = true;
          if (setup && typeof setup.isFirstTimeSetupDone === "boolean") {
            newValue = !setup.isFirstTimeSetupDone;
          }
          if (setup) {
            await writeFirstTimeSetup({ ...setup, isFirstTimeSetupDone: newValue });
          } else {
            await writeFirstTimeSetup({
              SchoolID: "",
              SchoolPass: "",
              Username: "",
              Password: "",
              isFirstTimeSetupDone: newValue,
            });
          }
          setToast(`isFirstTimeSetupDone ถูกตั้งเป็น ${newValue ? "true" : "false"}`);
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, []);
  const { mode, setMode, paletteId, setPaletteId, fontId, setFontId } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // ใช้ useLiveQuery - จะอัพเดทอัตโนมัติเมื่อข้อมูลเปลี่ยน
  const installedApps: string[] = useInstalledApps() ?? [];
  const isFirstTime: boolean | undefined = useIsFirstTime();

  const isFirstRender = useRef(true);
  const location = useLocation();
  const menuItems = useMemo(() => {
    const installed = apps.filter((app) => installedApps.includes(app.id));
    return [
      ...baseMenuItems.slice(0, 1),
      {
        id: "apps",
        label: "Apps",
        icon: <Box size={18} />,
        basePath: "/apps",
        subItems: [
          { label: "All Apps", path: "/apps" },
          ...installed.map((app) => ({
            label: app.name,
            labelEn: (app as any).nameEn || app.name,
            path: `/apps/${app.id}/${app.pages[0]?.path ?? ""}`,
          })),
        ],
      },
      ...baseMenuItems.slice(1),
    ];
  }, [installedApps]);
  const expandedKeys = useMemo(() => {
    const match = menuItems.find((item) =>
      location.pathname.startsWith(item.basePath)
    );
    return match ? [match.id] : [];
  }, [location.pathname, menuItems]);
  const toggleSidebar = () => setIsSidebarOpen((current) => !current);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const palette = themePalettes.find((item) => item.id === paletteId);
    const font = themeFonts.find((item) => item.id === fontId);
    const messageParts = [
      palette ? `Theme: ${palette.label}` : null,
      font ? `Font: ${font.label}` : null,
      `Mode: ${mode}`,
    ].filter(Boolean);

    setToast(messageParts.join(" • "));
    const timeout = window.setTimeout(() => setToast(null), 2200);

    return () => window.clearTimeout(timeout);
  }, [mode, paletteId, fontId]);

  useEffect(() => {
    function handleFavoritesUpdated(event: Event) {
      const detail = (event as CustomEvent<{ favorites?: string[] }>).detail;
      const list = detail?.favorites ?? [];
      const names = list
        .map((id) => apps.find((app) => app.id === id)?.name)
        .filter(Boolean) as string[];

      if (names.length === 0) {
        setToast("Favorites cleared");
      } else {
        setToast(`Favorites: ${names.join(", ")}`);
      }

      const timeout = window.setTimeout(() => setToast(null), 2200);
      return () => window.clearTimeout(timeout);
    }

    window.addEventListener("favorites:updated", handleFavoritesUpdated);
    return () => window.removeEventListener("favorites:updated", handleFavoritesUpdated);
  }, []);

  // รอให้ useLiveQuery โหลดข้อมูลเสร็จก่อน
  if (isFirstTime === undefined) {
    return <div className="app-loading">Loading...</div>;
  }

  if (isFirstTime) {
    return <FirstimeSetupFlow />;
  }

  return (
    <TranslationProvider>
      <ToastProvider>
      <div className="app">
        <div className={`toast${toast ? " is-visible" : ""}`}>
          {toast}
        </div>
        <header className="appbar">
          <div className="appbar-inner">
            <div className="appbar-brand">
              <div className="brand-mark">AP</div>
              <div className="brand-text">
                <div className="brand-title">Ambridge</div>
                <div className="brand-subtitle">PLATFORM</div>
              </div>
            </div>
            <div className="appbar-center">
              <TranslationBar />
            </div>
            <div className="appbar-actions">
              <QuickAppsBar />
              <Button
                isIconOnly
                variant="flat"
                aria-label={
                  mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
                }
                onPress={() =>
                  setMode((current: ThemeMode) => (current === "dark" ? "light" : "dark"))
                }
                className="theme-toggle"
              >
                {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>  
              <Avatar
                showFallback
                name="Jane"
                size="sm"
                className="appbar-avatar w-6 h-6 text-tiny"
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              />
            </div>
          </div>
        </header>

        <div className={`layout ${isSidebarOpen ? "" : "sidebar-hidden"}`}>
          <aside className="sidebar">
            <Card className="sidebar-card">
              <CardHeader className="sidebar-header">
                <div>
                  <div className="sidebar-title">STSS</div>
                  <div className="sidebar-caption">School</div>
                </div>
                <div className="sidebar-actions">
                  <Chip size="sm" color="primary" variant="flat">
                    v4
                  </Chip>
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
                        {item.subItems.map((sub) => {
                          const isActive = location.pathname === sub.path;

                          return (
                            <Button
                              key={sub.path}
                              as={Link}
                              to={sub.path}
                              disableRipple
                              variant={isActive ? "solid" : "light"}
                              color={isActive ? "primary" : "default"}
                              className={`submenu-button${isActive ? " is-active" : ""}`}
                              size="sm"
                              onMouseEnter={() => {
                                try {
                                  const evt = new CustomEvent("_setTranslation", { detail: { text: (sub as any).labelEn || sub.label } });
                                  window.dispatchEvent(evt);
                                } catch (e) {}
                              }}
                              onMouseLeave={() => {
                                try {
                                  const evt = new CustomEvent("_setTranslation", { detail: { text: "" } });
                                  window.dispatchEvent(evt);
                                } catch (e) {}
                              }}
                            >
                              <span className="submenu-item">
                                <span className="submenu-icon">
                                  <ChevronRight size={14} />
                                </span>
                                <span className="submenu-text">{sub.label}</span>
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </aside>

          <main className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/overview" />} />
              <Route
                path="/dashboard/overview"
                element={
                  <DashboardPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
              <Route
                path="/dashboard/insights"
                element={
                  <InsightsPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
              <Route
                path="/orders/all"
                element={
                  <OrdersPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
              <Route
                path="/orders/fulfillment"
                element={
                  <FulfillmentPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
              <Route
                path="/settings/profile"
                element={
                  <ProfilePage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
              <Route
                path="/settings/preferences"
                element={
                  <PreferencesPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
              <Route
                path="/settings/theme"
                element={
                  <ThemeSettingsPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                    theme={{
                      mode,
                      setMode,
                      paletteId,
                      setPaletteId,
                      fontId,
                      setFontId,
                    }}
                  />
                }
              />
              <Route path="/apps" element={<AppsListPage isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />} />
              <Route path="/apps/:appId" element={<MiniAppShell isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />}>
                <Route path=":page" element={<AppPage />} />
                <Route index element={<AppPage />} />
              </Route>
              <Route
                path="/devtools"
                element={
                  <PageShell
                    title="🛠️ DevTools"
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  >
                    <DevToolsPage />
                  </PageShell>
                }
              />
              <Route
                path="*"
                element={
                  <NotFoundPage
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
      </ToastProvider>
    </TranslationProvider>
  );
}

function PageHeader({
  title,
  subtitle,
  actions,
  isSidebarOpen,
  onToggleSidebar,
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
        <div>
          <h1>{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}

function PageShell({ children, ...headerProps }: PageShellProps) {
  return (
    <div className="page-shell">
      <PageHeader {...headerProps} />
      <div className="page">{children}</div>
    </div>
  );
}

function DashboardPage({
  isSidebarOpen,
  onToggleSidebar,
}: SidebarToggleProps) {
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

function InsightsPage({ isSidebarOpen, onToggleSidebar }: SidebarToggleProps) {
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
              <CardHeader>firstTImeSetup</CardHeader>
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

function OrdersPage({ isSidebarOpen, onToggleSidebar }: SidebarToggleProps) {
  return (
    <PageShell
      title="Orders"
      subtitle="Filter, tag, and track every order."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={<Button color="primary">New order</Button>}
    >
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
    </PageShell>
  );
}

function FulfillmentPage({
  isSidebarOpen,
  onToggleSidebar,
}: SidebarToggleProps) {
  return (
    <PageShell
      title="Fulfillment"
      subtitle="Prepare shipments and manage carriers."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={<Button variant="flat">Export labels</Button>}
    >
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
            <Progress value={82} color="secondary" className="stat-progress" aria-label="Carrier SLA on-time dispatch rate" />
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
    </PageShell>
  );
}

function ProfilePage({ isSidebarOpen, onToggleSidebar }: SidebarToggleProps) {
  return (
    <PageShell
      title="Profile"
      subtitle="Keep your personal details updated."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={<Button color="primary">Save changes</Button>}
    >
      <Card>
        <CardBody className="profile-grid">
          <Avatar
            size="sm"
            src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            alt="Small Avatar"
            name="SM"
          />
          <div className="profile-fields">
            <Input label="Full name" placeholder="Somchai Tech" />
            <Input label="Email" placeholder="somchai@example.com" />
            <Input label="Role" placeholder="Product lead" />
          </div>
        </CardBody>
      </Card>
    </PageShell>
  );
}

function PreferencesPage({
  isSidebarOpen,
  onToggleSidebar,
}: SidebarToggleProps) {
  return (
    <PageShell
      title="Preferences"
      subtitle="Tune notifications and workspace mode."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={<Button variant="flat">Reset</Button>}
    >
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
    </PageShell>
  );
}

// ThemeSettingsPage moved to src/pages/ThemeSettingsPage.tsx

function NotFoundPage({ isSidebarOpen, onToggleSidebar }: SidebarToggleProps) {
  return (
    <PageShell
      title="Page not found"
      subtitle="Try a menu link to continue."
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      actions={
        <Button as={Link} to="/dashboard/overview" color="primary">
          Go to dashboard
        </Button>
      }
    >
      <Card>
        <CardBody className="notfound">
          <div>
            <h2>We could not find that page.</h2>
            <p className="page-subtitle">Check the URL or use the menu.</p>
          </div>
        </CardBody>
      </Card>
    </PageShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
