import type { Locale } from "@fb/utils/navigation";
import { usePathname, useRouter } from "@fb/utils/navigation";

/**
 * Get change locale function
 *
 * @returns Function to change locale
 */
export const useChangeLocale = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (locale: Locale) => router.replace(pathname, { locale });
};
