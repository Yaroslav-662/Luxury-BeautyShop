// src/shared/ui/Select.tsx
import React from "react";

type Props = {
  label?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;

  disabled?: boolean;
  id?: string;
  name?: string;
  "aria-label"?: string;
};

export default function Select({
  label,
  value,
  onChange,
  children,
  disabled,
  id,
  name,
  "aria-label": ariaLabel,
}: Props) {
  const computedAria = ariaLabel || label || name || "Select";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm opacity-80">
          {label}
        </label>
      )}

      <select
        id={id}
        name={name}
        aria-label={computedAria}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={
          "px-3 py-2 border border-gray-700 rounded-lg bg-black/40 text-white outline-none " +
          (disabled ? "opacity-60 cursor-not-allowed" : "hover:border-gray-500")
        }
      >
        {children}
      </select>
    </div>
  );
}
