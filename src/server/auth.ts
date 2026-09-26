import { createHmac, timingSafeEqual } from "crypto";

export const adminCookieName = "admin_session";

export function adminSessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("resume-admin").digest("hex");
}

export function isAdminToken(token: string | undefined | null) {
  const expected = adminSessionToken();
  if (!expected || !token) return false;
  const actual = Buffer.from(token);
  const wanted = Buffer.from(expected);
  if (actual.length !== wanted.length) return false;
  return timingSafeEqual(actual, wanted);
}
