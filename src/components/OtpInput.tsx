import { useEffect, useRef } from "react";

type Props = {
  length?: number;
  value: string; // string of digits
  onChange: (value: string) => void;
  className?: string;
};

export default function OtpInput({ length = 6, value, onChange, className = "" }: Props) {
  const digits = value.replace(/[^A-Za-z0-9]/g, "").slice(0, length).split("");
  while (digits.length < length) digits.push("");

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // ensure value trimmed to digits only
    const clean = value.replace(/[^0-9]/g, "").slice(0, length);
    if (clean !== value) onChange(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (idx: number, v: string) => {
    const digit = v.replace(/[^A-Za-z0-9]/g, "").slice(0, 1);
    const next = [...digits];
    next[idx] = digit;
    onChange(next.join(""));
    if (digit && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = "";
        onChange(next.join(""));
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const clearAll = () => {
    onChange("");
    refs.current[0]?.focus();
  };

  const anyFilled = digits.some(d => d !== "");

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-2">
        {digits.map((d, i) => (
            <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            value={d}
            inputMode="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all bg-white shadow-sm"
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
          />
        ))}
      </div>
      {anyFilled && (
        <button
          type="button"
          aria-label="Clear OTP"
          tabIndex={-1}
          onClick={clearAll}
          className="ml-1 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <title>Clear</title>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
