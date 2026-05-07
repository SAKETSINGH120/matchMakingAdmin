import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-theme-light-border bg-theme-light-surface shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`border-b border-theme-light-border px-6 py-4 transition-colors duration-200 dark:border-theme-dark-border ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`border-t border-theme-light-border px-6 py-4 transition-colors duration-200 dark:border-theme-dark-border ${className}`}
    >
      {children}
    </div>
  );
}
