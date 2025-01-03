import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@/app/styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query_provider";

import { dark } from "@clerk/themes";

import { ThemeProvider } from "@/components/utils/theme-provider";
import { SearchProvider } from "@/components/api/use-search";
import { NextUIProvider } from "@nextui-org/react";
import QueueProvider from "@/providers/queue-provider";
import { SheetsProvider } from "@/providers/sheet_provider";
import { TooltipProvider } from "@/components/ui/tooltip";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Groovy Music",
  description: "Feel the Beat, Live the Rhythm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
          <NextUIProvider>
            <QueryProvider>
                <QueueProvider>
                  <SearchProvider>
                    <SheetsProvider />
                    <ThemeProvider attribute="class" defaultTheme="dark">
                      {children}
                    </ThemeProvider>
                  </SearchProvider>
                </QueueProvider>
            </QueryProvider>
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
