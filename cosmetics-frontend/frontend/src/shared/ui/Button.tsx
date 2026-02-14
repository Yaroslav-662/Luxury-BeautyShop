import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "outline"
  | "ghost";

type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className,
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "rounded font-medium transition",
        {
          primary: "bg-black text-gold",
          secondary: "bg-gray-800 text-white",
          danger: "bg-red-600 text-white",
          success: "bg-green-600 text-white",
          warning: "bg-yellow-500 text-black",
          outline: "border border-gold text-gold",
          ghost: "text-gold hover:bg-gold/10",
        }[variant],
        {
          sm: "px-3 py-1 text-sm",
          md: "px-4 py-2",
          lg: "px-6 py-3 text-lg",
        }[size],
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
