import { cache } from "react";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const createCaller = cache(async () => {
  return appRouter.createCaller(await createTRPCContext());
});
