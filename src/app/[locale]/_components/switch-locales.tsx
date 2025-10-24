import type { Locale } from "@fb/utils/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fb/ui/select";
import { locales } from "@fb/utils/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useChangeLocale } from "~/hooks/change-locale";

/** Switch between locales component */
export const SwitchLocales = () => {
  const t = useTranslations("pages.dashboard.customize.locale");
  const currentLocale = useLocale();
  const change = useChangeLocale();

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={(value) => change(value as Locale)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => {
          return (
            <SelectItem key={locale} value={locale}>
              {t(locale)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
