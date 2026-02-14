import React, { ReactNode } from "react";
import  FadeIn  from "@/shared/animations/FadeIn";

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const WidgetSection: React.FC<Props> = ({
  children,
  title,
  description,
  className = "",
}) => {
  return (
    <section className={`py-10 md:py-14 ${className}`}>
      <FadeIn>
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gold mb-3 tracking-wide">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-gray-400 text-lg max-w-2xl mb-6">
            {description}
          </p>
        )}
      </FadeIn>

      <FadeIn delay={0.1}>{children}</FadeIn>
    </section>
  );
};
