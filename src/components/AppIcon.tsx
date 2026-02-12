import React from "react";
import {
  AddressBook,
  ChartLineUp,
  ClipboardList,
  CreditCard,
  ShoppingBag,
} from "flowbite-react-icons/outline";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  inventory: ClipboardList,
  analytics: ChartLineUp,
  crm: AddressBook,
  billing: CreditCard,
  catalog: ShoppingBag,
};

type AppIconProps = {
  appId: string;
  color?: string;
  size?: number;
  className?: string;
};

export default function AppIcon({ appId, color, size = 22, className }: AppIconProps) {
  const Icon = iconMap[appId] ?? ClipboardList;
  return <Icon size={size} className={className} style={{ color: color ?? "var(--app-accent)" }} />;
}
