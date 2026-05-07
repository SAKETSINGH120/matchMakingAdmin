import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-[0px_0px_4px] shadow-gray-400 dark:bg-dark/90 dark:shadow-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`border-b border-gray-200 px-6 py-4 dark:border-dark/80 ${className}`}
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
      className={`border-t border-gray-200 px-6 py-4 dark:border-dark/80 ${className}`}
    >
      {children}
    </div>
  );
}
