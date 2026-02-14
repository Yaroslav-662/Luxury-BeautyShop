import React from "react";

export function AdminShell({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gold-300">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
        </div>
        {right}
      </div>

      <div className="border border-neutral-800 bg-neutral-900/50 rounded-2xl p-4 md:p-6">
        {children}
      </div>
    </div>
  );
}

export function AdminCard({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="border border-neutral-800 bg-neutral-950/40 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-white font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-neutral-400">{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function AdminRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
      <div className="text-sm text-neutral-400 md:pt-2">{label}</div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}
