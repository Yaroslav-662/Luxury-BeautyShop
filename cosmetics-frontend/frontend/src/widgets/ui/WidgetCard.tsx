import React, { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const WidgetCard: React.FC<Props> = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <div
      className={clsx(
        "bg-black/40 border border-gold/20 rounded-xl p-6 shadow-lg backdrop-blur-md",
        hover &&
          "transition-all duration-300 hover:shadow-gold/40 hover:border-gold/50 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};
