import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { localizedTextSchema } from "~/utils/localized";
import { adminProcedure, publicProcedure, router } from "~/server/api/trpc";

const technologySchema = z.object({
  name: localizedTextSchema,
  sortOrder: z.number().int().optional(),
});

const include = {
  technologies: { orderBy: { sortOrder: "asc" as const } },
};

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: localizedTextSchema,
  excerpt: localizedTextSchema.optional(),
  content: localizedTextSchema,
  technologies: z.array(technologySchema).optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

const updateSchema = createSchema.partial().extend({ id: z.string() });

function technologyCreate(technologies: z.infer<typeof technologySchema>[]) {
  return technologies.map((item, index) => ({
    name: item.name,
    sortOrder: item.sortOrder ?? index,
  }));
}

export const projectRouter = router({
  all: publicProcedure.query(({ ctx }) =>
    ctx.prisma.project.findMany({
      where: ctx.isAdmin ? undefined : { active: true },
      orderBy: { sortOrder: "asc" },
      include,
    }),
  ),
  single: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.prisma.project.findUnique({
        where: { id: input.id },
        include,
      });
      if (!row || (!row.active && !ctx.isAdmin)) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return row;
    }),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const row = await ctx.prisma.project.findUnique({
        where: { slug: input.slug },
        include,
      });
      if (!row || (!row.active && !ctx.isAdmin)) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return row;
    }),
  create: adminProcedure.input(createSchema).mutation(({ ctx, input }) => {
    const { technologies = [], ...data } = input;
    return ctx.prisma.project.create({
      data: {
        ...data,
        technologies: { create: technologyCreate(technologies) },
      },
      include,
    });
  }),
  update: adminProcedure.input(updateSchema).mutation(({ ctx, input }) => {
    const { id, technologies, ...data } = input;
    return ctx.prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(technologies
          ? {
              technologies: {
                deleteMany: {},
                create: technologyCreate(technologies),
              },
            }
          : {}),
      },
      include,
    });
  }),
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.prisma.project.delete({ where: { id: input.id } })),
  toggle: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const current = await ctx.prisma.project.findUnique({ where: { id: input.id } });
      if (!current) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.prisma.project.update({
        where: { id: input.id },
        data: { active: !current.active },
      });
    }),
  reorder: adminProcedure
    .input(z.object({ id: z.string(), sortOrder: z.number().int() }))
    .mutation(({ ctx, input }) =>
      ctx.prisma.project.update({
        where: { id: input.id },
        data: { sortOrder: input.sortOrder },
      }),
    ),
});
