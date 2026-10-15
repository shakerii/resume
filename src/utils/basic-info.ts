export const BASIC_INFO_KEYS = [
  "name",
  "title",
  "website",
  "email",
  "phone",
  "github",
  "location",
  "summary",
] as const;

export type BasicInfoKey = (typeof BASIC_INFO_KEYS)[number];
