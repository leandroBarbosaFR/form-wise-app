"use client";

import { useEffect, useState } from "react";

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour >= 6 && hour < 18 ? "Bonjour" : "Bonsoir");
  }, []);

  return (
    <h2 className="text-lg font-semibold">
      {greeting} {name}
    </h2>
  );
}
