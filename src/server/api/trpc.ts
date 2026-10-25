import { TRPCError, initTRPC } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "~/server/db";
import { isAdminToken, adminCookieName } from "~/server/auth";
import { resumeCacheTag } from "~/server/resume-cache";

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
export const adminProcedure = t.procedure.use(async ({ ctx, next, type }) => {
  if (!ctx.isAdmin) throw new TRPCError({ code: "UNAUTHORIZED" });
  const result = await next({ ctx });
  if (type === "mutation" && result.ok)
    revalidateTag(resumeCacheTag, { expire: 0 });
  return result;
});
