import type * as React from "react";
import { Inter, Vazirmatn } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazir" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${vazir.variable}`}>
      <body>{children}</body>
    </html>
  );
}
