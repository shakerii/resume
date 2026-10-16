"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useId, type FormEvent } from "react";
import { getContactAnalyticsIdentity } from "~/components/analytics/analytics-tracker";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";

export function ContactForm({
  variant = "classic",
}: {
  variant?: "classic" | "future";
}) {
  const t = useTranslations("contact");
  const pathname = usePathname();
  const formId = useId();
  const submit = api.contact.submit.useMutation();
  const futuristic = variant === "future";
  const inputClassName = futuristic
    ? "border-cyan-400/30 bg-slate-950/70 text-slate-100 focus-visible:ring-cyan-400"
    : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submit.isPending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    submit.reset();
    try {
      await submit.mutateAsync({
        name: String(values.get("name") ?? "").trim(),
        email: String(values.get("email") ?? "").trim(),
        subject: String(values.get("subject") ?? "").trim(),
        message: String(values.get("message") ?? "").trim(),
        website: String(values.get("website") ?? ""),
        path: pathname,
        ...getContactAnalyticsIdentity(),
      });
      form.reset();
    } catch {
      return;
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby={`${formId}-title`}
      className={cn(
        "mt-8 print:hidden",
        futuristic &&
          "mt-20 rounded-xl border border-cyan-400/20 bg-slate-900/40 p-6",
      )}
    >
      <h2
        id={`${formId}-title`}
        className={cn(
          "border-b pb-1 text-xl font-semibold",
          futuristic && "border-cyan-400/20 font-mono text-cyan-200",
        )}
      >
        {t("title")}
      </h2>
      <p
        className={cn(
          "mt-3 text-sm text-muted-foreground",
          futuristic && "text-slate-300",
        )}
      >
        {t("description")}
      </p>
      <form
        data-analytics="contact-form"
        className="mt-5"
        onSubmit={handleSubmit}
        aria-busy={submit.isPending}
      >
        <fieldset disabled={submit.isPending} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={`${formId}-name`} className="text-sm font-medium">
                {t("name")}
              </label>
              <Input
                id={`${formId}-name`}
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-email`}
                className="text-sm font-medium"
              >
                {t("email")}
              </label>
              <Input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                dir="ltr"
                required
                maxLength={254}
                className={inputClassName}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-subject`}
              className="text-sm font-medium"
            >
              {t("subject")}
            </label>
            <Input
              id={`${formId}-subject`}
              name="subject"
              required
              maxLength={200}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-message`}
              className="text-sm font-medium"
            >
              {t("message")}
            </label>
            <Textarea
              id={`${formId}-message`}
              name="message"
              required
              maxLength={5000}
              rows={6}
              className={inputClassName}
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>{t("website")}</label>
            <input
              id={`${formId}-website`}
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            disabled={submit.isPending}
            className={
              futuristic
                ? "border border-cyan-400/40 bg-cyan-950 font-mono text-cyan-100 hover:bg-cyan-900"
                : undefined
            }
          >
            {submit.isPending ? t("sending") : t("send")}
          </Button>
        </fieldset>
        {submit.isSuccess ? (
          <p
            role="status"
            className={cn(
              "mt-3 text-sm text-green-700",
              futuristic && "text-lime-300",
            )}
          >
            {t("success")}
          </p>
        ) : null}
        {submit.isError ? (
          <p
            role="alert"
            className={cn(
              "mt-3 text-sm text-destructive",
              futuristic && "text-red-300",
            )}
          >
            {t("error")}
          </p>
        ) : null}
      </form>
    </section>
  );
}
