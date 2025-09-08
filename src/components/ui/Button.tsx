"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "px-4 py-2 rounded-xl font-semibold shadow-md transition",
        "bg-[#F0EBD8] text-black hover:bg-[#e6dfc8] active:scale-95",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
