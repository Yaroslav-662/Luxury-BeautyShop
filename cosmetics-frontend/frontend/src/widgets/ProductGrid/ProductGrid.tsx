import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProductGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}
