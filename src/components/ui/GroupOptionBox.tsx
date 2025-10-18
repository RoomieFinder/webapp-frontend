'use client';
import React from "react";
// Reusable GroupOptionBox Component
interface GroupOptionBoxProps {
  title: string;
  description: string;
  path: string;
  onClick?: () => void;
}

function GroupOptionBox({ title, description, path, onClick }: GroupOptionBoxProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to path (you can use react-router here)
      window.location.href = path;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-slate-600/50 hover:bg-slate-600/70 transition-all duration-200 rounded-2xl p-8 text-left cursor-pointer border-2 border-transparent hover:border-slate-500"
    >
      <h3 className="text-white text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-lg">{description}</p>
    </button>
  );
}

export default GroupOptionBox;