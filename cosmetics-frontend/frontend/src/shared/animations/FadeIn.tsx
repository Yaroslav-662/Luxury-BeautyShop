import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
}

export default function FadeIn({ children }: Props) {
  return <div className="animate-fadeIn">{children}</div>;
}
