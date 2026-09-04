import { initTRPC } from "@trpc/server";
import { prisma } from "~/server/db";

const t = initTRPC.context<{}>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const createContext = () => ({ prisma });
