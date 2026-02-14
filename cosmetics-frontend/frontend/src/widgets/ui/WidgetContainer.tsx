import React, { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-full",
};

export const WidgetContainer: React.FC<Props> = ({
  children,
  className = "",
  size = "lg",
}) => {
  return (
    <div
      className={clsx(
        "mx-auto px-4 md:px-6 lg:px-8 w-full",
        sizeMap[size],
        className
      )}
    >
      {children}
    </div>
  );
};
