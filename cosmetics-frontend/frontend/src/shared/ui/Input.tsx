import { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={clsx(
        "w-full rounded border border-gray-600 bg-black text-white px-3 py-2",
        className
      )}
      {...props}
    />
  );
}
