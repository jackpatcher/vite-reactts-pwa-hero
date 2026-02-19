import React from "react";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import { useTranslationBar } from "../contexts/TranslationContext";

export default function TranslationBar() {
  const { text } = useTranslationBar();
  return (
    <div className="appbar-search-wrap">
      <Input
        aria-label="Translation bar"
        placeholder=""
        startContent={<Search size={16} />}
        variant="flat"
        size="sm"
        className="appbar-search"
        value={text}
        onChange={() => {}}
        readOnly
      />
    </div>
  );
}
