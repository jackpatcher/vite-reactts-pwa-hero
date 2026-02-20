import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

type Option = {
  key: string;
  label: string;
  accent?: "sky" | "amber" | "violet" | "pink" | "green" | "default";
};

type Props = {
  options: Option[];
  selectedKey: string;
  onChange: (key: string) => void;
  menuWidth?: string; // tailwind width class like 'w-44'
};

const accentClassMap: Record<string, string> = {
  sky: "group-hover:bg-sky-500 dark:group-hover:bg-sky-400",
  amber: "group-hover:bg-amber-400 dark:group-hover:bg-amber-300",
  violet: "group-hover:bg-violet-400 dark:group-hover:bg-violet-300",
  pink: "group-hover:bg-pink-400 dark:group-hover:bg-pink-300",
  green: "group-hover:bg-green-400 dark:group-hover:bg-green-300",
  default: "group-hover:bg-sky-500 dark:group-hover:bg-sky-400",
};

const colorPropMap: Record<string, string> = {
  sky: "success",
  amber: "warning",
  violet: "primary",
  pink: "primary",
  green: "success",
  default: "success",
};

export default function SimpleDropdown({ options, selectedKey, onChange, menuWidth = "w-44" }: Props) {
  const selected = options.find((o) => o.key === selectedKey);
  const color = selectedKey === "all" ? undefined : colorPropMap[selected?.accent || "default"];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="capitalize py-1 px-3 rounded-full text-sm border border-gray-200 shadow-sm relative overflow-hidden"
          variant="bordered"
          color={color as any}
        >
          {selectedKey === "all" ? options[0]?.label ?? "ทั้งหมด" : selected?.label}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        className={`bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-lg rounded-xl py-1 ${menuWidth}`}
        disallowEmptySelection
        aria-label="Select"
        selectedKeys={new Set([selectedKey])}
        selectionMode="single"
        variant="flat"
        onSelectionChange={(keys: Set<string>) => {
          const v = Array.from(keys as Iterable<string>)[0] ?? options[0]?.key ?? "all";
          onChange(v);
        }}
      >
        {options.map((opt) => (
          <DropdownItem className="group px-0" key={opt.key}>
            <div className="flex items-center">
              <span className={`w-1 h-8 bg-transparent rounded-l-md mr-3 transition-colors ${accentClassMap[opt.accent ?? "default"]}`} />
              <span className="px-4 py-2 text-sm w-full text-gray-900 dark:text-white">{opt.label}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
