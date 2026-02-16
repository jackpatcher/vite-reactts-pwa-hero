
import {
  Cog,
  Archive,
  Database,
  Refresh,
  Clipboard,
  Tablet,
  FileChartBar,
  TrashBin,
  Plus,
  Search,
} from "flowbite-react-icons/outline";

import type { FC } from "react";

const iconMap: Record<string, FC<{ size?: number; className?: string }>> = {
  config: Cog,
  appState: Tablet,
  package: Archive,
  analytics: FileChartBar,
  overview: FileChartBar,
  database: Database,
  refresh: Refresh,
  clipboard: Clipboard,
  trash: TrashBin,
  plus: Plus,
  search: Search,
};

export type FlowbiteIconName = keyof typeof iconMap;

export function FlowbiteIcon({ name, size = 20, className = "" }: { name: FlowbiteIconName; size?: number; className?: string }) {
  const Icon = iconMap[name] || Database;
  return <Icon size={size} className={className} />;
}
