import { TRPCError, initTRPC } from "@trpc/server";
import { cookies } from "next/headers";
import { prisma } from "~/server/db";
import { isAdminToken, adminCookieName } from "~/server/auth";

export async function createTRPCContext() {
  const cookieStore = await cookies();
  return {
    prisma,
    isAdmin: isAdminToken(cookieStore.get(adminCookieName)?.value),
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});
