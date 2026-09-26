import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { localizedTextSchema } from "~/utils/localized";
import { adminProcedure, publicProcedure, router } from "~/server/api/trpc";

const createSchema = z.object({
  company: localizedTextSchema,
  role: localizedTextSchema,
  period: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

const updateSchema = createSchema.partial().extend({ id: z.string() });

export const experienceRouter = router({
  all: publicProcedure.query(({ ctx }) =>
    ctx.prisma.experience.findMany({
      where: ctx.isAdmin ? undefined : { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ),
  single: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.prisma.experience.findUnique({ where: { id: input.id } });
      if (!row || (!row.active && !ctx.isAdmin)) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return row;
    }),
  create: adminProcedure.input(createSchema).mutation(({ ctx, input }) =>
    ctx.prisma.experience.create({ data: input }),
  ),
  update: adminProcedure.input(updateSchema).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.experience.update({ where: { id }, data });
  }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.prisma.experience.delete({ where: { id: input.id } })),
  toggle: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const current = await ctx.prisma.experience.findUnique({ where: { id: input.id } });
      if (!current) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.prisma.experience.update({
        where: { id: input.id },
        data: { active: !current.active },
      });
    }),
  reorder: adminProcedure
    .input(z.object({ id: z.string(), sortOrder: z.number().int() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.experience.update({
        where: { id: input.id },
        data: { sortOrder: input.sortOrder },
      }),
    ),
});
