"use client";

import { ThemeProvider } from "next-themes";
import useFirebaseMessaging from "../hooks/useFirebaseMessaging";

export function Providers({ children }: { children: React.ReactNode }) {
  useFirebaseMessaging();

  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
