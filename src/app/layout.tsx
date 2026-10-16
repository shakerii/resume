import type * as React from "react";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { siteUrl } from "~/utils/seo";

import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/Inter-Latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const vazir = localFont({
  src: "../../public/fonts/Vazirmatn-Regular.ttf",
  variable: "--font-vazir",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${inter.variable} ${vazir.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
