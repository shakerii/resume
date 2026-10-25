import type * as React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { AnalyticsTracker } from "~/components/analytics/analytics-tracker";
import { notFound } from "next/navigation";
import { locales, type Locale } from "~/utils/navigation";
import { siteUrl } from "~/utils/seo";

import "../globals.css";

const inter = localFont({
  src: "../../../public/fonts/Inter-Latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const vazir = localFont({
  src: "../../../public/fonts/Vazirmatn-Regular.ttf",
  variable: "--font-vazir",
  weight: "400",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const icons: Metadata["icons"] = {
  icon: [{ url: "/avatar.jpg", type: "image/jpeg" }],
  apple: [{ url: "/avatar.jpg" }],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    return { metadataBase: siteUrl, icons };
  }
  const t = await getTranslations({ locale, namespace: "global" });
  return {
    metadataBase: siteUrl,
    icons,
    title: t("title"),
    description: t("description"),
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "white" }],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const messages = await getMessages();
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${inter.variable} ${vazir.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsTracker />
          <div className={locale === "fa" ? "font-vazir" : "font-inter"}>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
