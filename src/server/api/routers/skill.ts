import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { localizedTextSchema } from "~/utils/localized";
import { adminProcedure, publicProcedure, router } from "~/server/api/trpc";

const include = { group: true };

const createSchema = z.object({
  name: localizedTextSchema,
  groupId: z.string().min(1),
  rating: z.number().int().min(0).max(10),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

const updateSchema = createSchema.partial().extend({ id: z.string() });

export const skillRouter = router({
  all: publicProcedure.query(({ ctx }) =>
    ctx.prisma.skill.findMany({
      where: ctx.isAdmin ? undefined : { active: true, group: { active: true } },
      orderBy: { sortOrder: "asc" },
      include,
    }),
  ),
  single: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const row = await ctx.prisma.skill.findUnique({
      where: { id: input.id },
      include,
    });
    if (!row || (!row.active && !ctx.isAdmin)) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return row;
  }),
  create: adminProcedure
    .input(createSchema)
    .mutation(({ ctx, input }) => ctx.prisma.skill.create({ data: input, include })),
  update: adminProcedure.input(updateSchema).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.skill.update({ where: { id }, data, include });
  }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.prisma.skill.delete({ where: { id: input.id } })),
  toggle: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const current = await ctx.prisma.skill.findUnique({
      where: { id: input.id },
    });
    if (!current) throw new TRPCError({ code: "NOT_FOUND" });
    return ctx.prisma.skill.update({
      where: { id: input.id },
      data: { active: !current.active },
    });
  }),
  reorder: adminProcedure.input(z.object({ id: z.string(), sortOrder: z.number().int() })).mutation(({ ctx, input }) =>
    ctx.prisma.skill.update({
      where: { id: input.id },
      data: { sortOrder: input.sortOrder },
    }),
  ),
});
