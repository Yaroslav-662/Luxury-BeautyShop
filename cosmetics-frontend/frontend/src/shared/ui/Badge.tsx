import { ReactNode } from "react";
import clsx from "clsx";

type Variant = "default" | "success" | "danger" | "warning";

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: Props) {
  return (
    <span
      className={clsx(
        "px-2 py-1 rounded text-xs font-semibold",
        {
          default: "bg-gray-700 text-white",
          success: "bg-green-600 text-white",
          danger: "bg-red-600 text-white",
          warning: "bg-yellow-500 text-black",
        }[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
