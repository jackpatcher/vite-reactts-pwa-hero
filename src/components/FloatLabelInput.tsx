import { useState } from "react";

type Props = {
  id?: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  /* placeholder intentionally omitted; using placeholder=" " internally for float behavior */
  required?: boolean;
  className?: string;
};

export default function FloatLabelInput({ id, name, label, value, onChange, type = "text", required = false, className = "" }: Props) {
  const inputId = id || name || `float-input-${Math.random().toString(36).slice(2, 9)}`;
  const [focused, setFocused] = useState(false);
  const active = focused || !!value;

  const labelClass = active
    ? `absolute left-3 top-2 text-xs text-blue-600 -translate-y-0 transition-all duration-150 ease-out pointer-events-none z-10 bg-white px-1`
    : `absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all duration-150 ease-out pointer-events-none z-10 bg-white px-1`;

  // Keep input box height fixed but adjust top padding when active so value appears on a lower line
  const inputClass = `peer w-full px-3 h-14 bg-white border border-gray-300 rounded-md placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-xl leading-snug ${active ? "pt-8 pb-2" : "pt-4 pb-2"}`;

  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        placeholder={" "}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={inputClass}
      />
      <label htmlFor={inputId} className={labelClass}>{label}</label>
    </div>
  );
}
