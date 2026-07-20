"use client";

import { LocaleProvider } from "./i18n";
import type { ReactNode } from "react";

export function LocaleWrapper({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
