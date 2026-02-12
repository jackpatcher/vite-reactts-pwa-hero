export type AppPage = { id: string; label: string; path: string };

export type AppDef = {
  id: string;
  name: string;
  description?: string;
  details?: string;
  color?: string;
  logo?: string; // optional URL or emoji
  pages: AppPage[];
};

export const apps: AppDef[] = [
  {
    id: "inventory",
    name: "Inventory",
    description: "Stock & transfers",
    details: "Inventory helps you track stock levels, manage warehouses, and move items between locations with confidence.",
    color: "#2563eb",
    logo: "📦",
    pages: [
      { id: "overview", label: "Overview", path: "overview" },
      { id: "items", label: "Items", path: "items" },
      { id: "transfers", label: "Transfers", path: "transfers" },
      { id: "reports", label: "Reports", path: "reports" },
      { id: "settings", label: "Settings", path: "settings" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Dashboards & events",
    details: "Analytics provides dashboards, event streams, and cohort insights to help you understand performance at a glance.",
    color: "#10b981",
    logo: "📈",
    pages: [
      { id: "overview", label: "Overview", path: "overview" },
      { id: "dashboards", label: "Dashboards", path: "dashboards" },
      { id: "events", label: "Events", path: "events" },
      { id: "cohorts", label: "Cohorts", path: "cohorts" },
      { id: "settings", label: "Settings", path: "settings" },
    ],
  },
  {
    id: "crm",
    name: "CRM",
    description: "Contacts & deals",
    details: "CRM keeps customer profiles, pipelines, and activities organized so your team stays aligned.",
    color: "#f97316",
    logo: "👥",
    pages: [
      { id: "overview", label: "Overview", path: "overview" },
      { id: "contacts", label: "Contacts", path: "contacts" },
      { id: "pipelines", label: "Pipelines", path: "pipelines" },
      { id: "activities", label: "Activities", path: "activities" },
      { id: "settings", label: "Settings", path: "settings" },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    description: "Invoices & plans",
    details: "Billing handles invoices, subscription plans, and ledger tracking with clear visibility of revenue.",
    color: "#7c3aed",
    logo: "💳",
    pages: [
      { id: "overview", label: "Overview", path: "overview" },
      { id: "invoices", label: "Invoices", path: "invoices" },
      { id: "plans", label: "Plans", path: "plans" },
      { id: "ledger", label: "Ledger", path: "ledger" },
      { id: "settings", label: "Settings", path: "settings" },
    ],
  },
  {
    id: "catalog",
    name: "Catalog",
    description: "Products & pricing",
    details: "Catalog centralizes products, collections, and pricing so merchandising stays consistent.",
    color: "#ef4444",
    logo: "🛍️",
    pages: [
      { id: "overview", label: "Overview", path: "overview" },
      { id: "products", label: "Products", path: "products" },
      { id: "collections", label: "Collections", path: "collections" },
      { id: "pricing", label: "Pricing", path: "pricing" },
      { id: "settings", label: "Settings", path: "settings" },
    ],
  },
];
