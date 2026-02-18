import { useEffect, useRef } from "react";

type Props = {
  length?: number;
  value: string; // string of digits
  onChange: (value: string) => void;
  className?: string;
};

export default function OtpInput({ length = 6, value, onChange, className = "" }: Props) {
  const digits = value.split("").slice(0, length);
  while (digits.length < length) digits.push("");

  const refs = Array.from({ length }, () => useRef<HTMLInputElement | null>(null));

  useEffect(() => {
    // ensure value trimmed to digits only
    const clean = value.replace(/[^0-9]/g, "").slice(0, length);
    if (clean !== value) onChange(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (idx: number, v: string) => {
    const digit = v.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = digit;
    onChange(next.join(""));
    if (digit && idx < length - 1) {
      refs[idx + 1].current?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = "";
        onChange(next.join(""));
      } else if (idx > 0) {
        refs[idx - 1].current?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs[idx - 1].current?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs[idx + 1].current?.focus();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}> 
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          value={d}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white shadow-sm"
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
}
