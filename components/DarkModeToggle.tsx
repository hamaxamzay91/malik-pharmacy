"use client";

import { useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };

  return (
    <button
      onClick={toggle}
      title="Dark Mode"
      className="w-10 h-10 rounded-xl border border-line flex items-center justify-center text-ink-soft hover:border-green hover:text-green transition"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
