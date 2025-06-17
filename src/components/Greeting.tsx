"use client";

import { useEffect, useState } from "react";

export function Greeting({
  name,
  civility,
}: {
  name: string;
  civility: string;
}) {
  const [greeting, setGreeting] = useState("Bonjour");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour >= 6 && hour < 18 ? "Bonjour" : "Bonsoir");
  }, []);

  return (
    <h2 className="text-lg font-semibold">
      {greeting}, {civility} {name}
    </h2>
  );
}
