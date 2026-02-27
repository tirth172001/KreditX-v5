"use client";

import { useEffect } from "react";
import { useLoanStore } from "@/store/loanStore";

export function S5_AAIntro() {
  const { goTo } = useLoanStore();

  useEffect(() => {
    goTo(6);
  }, [goTo]);

  return null;
}
