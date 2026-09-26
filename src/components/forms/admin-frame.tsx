"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api, browserQuery } from "~/trpc/react";
import { cn } from "~/utils/cn";
import type { Locale } from "~/utils/navigation";

const links = [
  ["home", ""],
  ["basicInfo", "/basic-info"],
  ["experiences", "/experiences"],
  ["projects", "/projects"],
  ["skills", "/skills"],
  ["education", "/education"],
  ["languages", "/languages"],
] as const;

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const nav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const utils = api.useUtils();
  const me = api.admin.me.useQuery(undefined, browserQuery);
  const login = api.admin.login.useMutation({
    onSuccess: async () => {
      await utils.admin.me.invalidate();
    },
  });
  const logout = api.admin.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });
  const [password, setPassword] = useState("");

  if (!me.data) {
    return <p className="p-8 text-sm text-muted-foreground">{t("loading")}</p>;
  }

  if (!me.data.isAdmin) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>{t("loginTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                login.mutate({ password });
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {login.error ? <p className="text-sm text-destructive">{t("loginFailed")}</p> : null}
              <Button type="submit" disabled={login.isPending}>
                {t("login")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
      <aside className="space-y-2">
        <p className="px-3 text-sm font-semibold">{t("title")}</p>
        <nav className="flex flex-col gap-1">
          {links.map(([key, href]) => {
            const path = `/${locale}/admin${href}`;
            const active = pathname === path;
            return (
              <Link
                key={key}
                href={path}
                className={cn(
                  "rounded-md px-3 py-2 text-sm hover:bg-accent",
                  active && "bg-accent font-medium",
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2 px-3 pt-4">
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={`/${locale}`}>{nav("resume")}</Link>
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => logout.mutate()}>
            {t("logout")}
          </Button>
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}
