import type {Metadata, Viewport} from "next";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, getTranslations} from "next-intl/server";
import {TrpcProvider} from "~/trpc/react";
import {routing} from "~/utils/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("global");
  return {title: t("title"), description: t("description")};
}

export const viewport: Viewport = {
  themeColor: [{media: "(prefers-color-scheme: light)", color: "white"}],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <TrpcProvider>
        <div lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className={locale === "fa" ? "font-vazir" : "font-inter"}>
          {children}
        </div>
      </TrpcProvider>
    </NextIntlClientProvider>
  );
}
