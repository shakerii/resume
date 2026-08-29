"use client";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "~/utils/navigation";
export function useChangeLocale() { const router = useRouter(); const pathname = usePathname(); return (locale: Locale) => { const parts = pathname.split("/"); parts[1] = locale; router.push(parts.join("/")); }; }
