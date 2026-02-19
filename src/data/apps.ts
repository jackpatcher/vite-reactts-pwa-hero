export type AppPage = { id: string; label: string; labelEn?: string; path: string };

export type AppDef = {
  id: string;
  name: string; // Thai label
  nameEn?: string; // English tooltip
  description?: string;
  details?: string;
  color?: string;
  logo?: string; // optional URL or emoji
  pages: AppPage[];
};

export const apps: AppDef[] = [
  {
    id: "inventory",
    name: "คลังสินค้า",
    nameEn: "Inventory",
    description: "Stock & transfers",
    details: "Inventory helps you track stock levels, manage warehouses, and move items between locations with confidence.",
    color: "#2563eb",
    logo: "📦",
    pages: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", path: "overview" },
      { id: "items", label: "รายการสินค้า", labelEn: "Items", path: "items" },
      { id: "transfers", label: "ย้ายสินค้า", labelEn: "Transfers", path: "transfers" },
      { id: "reports", label: "รายงาน", labelEn: "Reports", path: "reports" },
      { id: "settings", label: "การตั้งค่า", labelEn: "Settings", path: "settings" },
    ],
  },
  {
    id: "analytics",
    name: "วิเคราะห์",
    nameEn: "Analytics",
    description: "Dashboards & events",
    details: "Analytics provides dashboards, event streams, and cohort insights to help you understand performance at a glance.",
    color: "#10b981",
    logo: "📈",
    pages: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", path: "overview" },
      { id: "dashboards", label: "แดชบอร์ด", labelEn: "Dashboards", path: "dashboards" },
      { id: "events", label: "เหตุการณ์", labelEn: "Events", path: "events" },
      { id: "cohorts", label: "กลุ่มผู้ใช้", labelEn: "Cohorts", path: "cohorts" },
      { id: "settings", label: "การตั้งค่า", labelEn: "Settings", path: "settings" },
    ],
  },
  {
    id: "crm",
    name: "ระบบลูกค้า",
    nameEn: "CRM",
    description: "Contacts & deals",
    details: "CRM keeps customer profiles, pipelines, and activities organized so your team stays aligned.",
    color: "#f97316",
    logo: "👥",
    pages: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", path: "overview" },
      { id: "contacts", label: "รายชื่อ", labelEn: "Contacts", path: "contacts" },
      { id: "pipelines", label: "กระบวนการ", labelEn: "Pipelines", path: "pipelines" },
      { id: "activities", label: "กิจกรรม", labelEn: "Activities", path: "activities" },
      { id: "settings", label: "การตั้งค่า", labelEn: "Settings", path: "settings" },
    ],
  },
  {
    id: "billing",
    name: "การเงิน",
    nameEn: "Billing",
    description: "Invoices & plans",
    details: "Billing handles invoices, subscription plans, and ledger tracking with clear visibility of revenue.",
    color: "#7caed",
    logo: "💳",
    pages: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", path: "overview" },
      { id: "invoices", label: "ใบแจ้งหนี้", labelEn: "Invoices", path: "invoices" },
      { id: "plans", label: "แผน", labelEn: "Plans", path: "plans" },
      { id: "ledger", label: "บัญชี", labelEn: "Ledger", path: "ledger" },
      { id: "settings", label: "การตั้งค่า", labelEn: "Settings", path: "settings" },
    ],
  },
  {
    id: "catalog",
    name: "แค็ตตาล็อก",
    nameEn: "Catalog",
    description: "Products & pricing",
    details: "Catalog centralizes products, collections, and pricing so merchandising stays consistent.",
    color: "#ef4444",
    logo: "🛍️",
    pages: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", path: "overview" },
      { id: "products", label: "สินค้า", labelEn: "Products", path: "products" },
      { id: "collections", label: "คอลเลกชัน", labelEn: "Collections", path: "collections" },
      { id: "pricing", label: "ตั้งราคา", labelEn: "Pricing", path: "pricing" },
      { id: "settings", label: "การตั้งค่า", labelEn: "Settings", path: "settings" },
    ],
  },
  {
    id: "sarabun",
    name: "Sarabun",
    nameEn: "Sarabun",
    description: "ระบบจัดการเอกสาร (ตัวอย่าง)",
    details: "รับไฟล์ PDF และส่งต่อเอกสารให้ผู้อนุมัติตามลำดับ (ผอ → รอง ผอ → เซ็น)",
    color: "#1f2937",
    logo: "📄",
    pages: [
      { id: "overview", label: "ภาพรวม", labelEn: "Overview", path: "overview" },
      { id: "upload", label: "อัปโหลด", labelEn: "Upload", path: "upload" },
      { id: "flow", label: "รายการ", labelEn: "Flow", path: "flow" },
      { id: "settings", label: "การตั้งค่า", path: "settings" },
    ],
  },
];
