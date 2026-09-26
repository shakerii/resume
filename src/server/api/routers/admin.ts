import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { adminCookieName, adminSessionToken } from "~/server/auth";
import { adminProcedure, publicProcedure, router } from "~/server/api/trpc";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
};

export const adminRouter = router({
  me: publicProcedure.query(({ ctx }) => ({ isAdmin: ctx.isAdmin })),
  login: publicProcedure
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const token = adminSessionToken();
      if (!token || input.password !== process.env.ADMIN_PASSWORD) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const cookieStore = await cookies();
      cookieStore.set(adminCookieName, token, cookieOptions);
      return { ok: true as const };
    }),
  logout: adminProcedure.mutation(async () => {
    const cookieStore = await cookies();
    cookieStore.delete(adminCookieName);
    return { ok: true as const };
  }),
});
