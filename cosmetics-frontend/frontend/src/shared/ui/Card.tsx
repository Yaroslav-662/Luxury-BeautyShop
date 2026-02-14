import { ReactNode } from "react";
import cn from "@/shared/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return <div className={cn("rounded border p-4", className)}>{children}</div>;
}
