"use client";

import { useState, useEffect } from "react";

interface UserStats {
  xp: number;
  hearts: number;
  streakDays: number;
  topikLevel: string;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return { stats };
}
