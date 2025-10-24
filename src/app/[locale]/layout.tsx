import type { Metadata, Viewport } from "next";
import { env } from "~/env";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("global");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("title"),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const direction = useTextDirection();
  const messages = useMessages();

  return (
    <html lang={locale} dir={direction}>
      <body className={local.className}></body>
    </html>
  );
}
