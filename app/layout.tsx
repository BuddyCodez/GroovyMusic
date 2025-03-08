import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@/app/styles.css";
import { QueryProvider } from "@/providers/query_provider";
import { ThemeProvider } from "@/components/utils/theme-provider";
import { SearchProvider } from "@/components/api/use-search";
import { HeroUIProvider } from "@heroui/react";
import QueueProvider from "@/providers/queue-provider";
import { SheetsProvider } from "@/providers/sheet_provider";
import { ConvexWrapper } from "./convexWrapper";
import {KindeProvider} from "@kinde-oss/kinde-auth-nextjs";
import { AuthProvider } from "@/providers/auth-provider";
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
    <html suppressHydrationWarning={true}>
      <body>
        <AuthProvider>
          <HeroUIProvider>
            <QueryProvider>
              <QueueProvider>
                <SearchProvider>
                  <ThemeProvider attribute="class" defaultTheme="dark">
                    {/* <ConvexWrapper> */}
                      <SheetsProvider />
                      {children}
                    {/* </ConvexWrapper> */}
                  </ThemeProvider>
                </SearchProvider>
              </QueueProvider>
            </QueryProvider>
          </HeroUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
