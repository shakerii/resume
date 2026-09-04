import { z } from "zod";
import { router, publicProcedure } from "./trpc";
import { prisma } from "~/server/db";

const crud = <T extends Record<string, unknown>>(
  model: any,
  createSchema: z.ZodTypeAny,
  updateSchema: z.ZodTypeAny,
) =>
  router({
    list: publicProcedure.query(() =>
      model.findMany({ orderBy: { sortOrder: "asc" } }),
    ),
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => model.findUnique({ where: { id: input.id } })),
    create: publicProcedure
      .input(createSchema)
      .mutation(({ input }) => model.create({ data: input })),
    update: publicProcedure.input(updateSchema).mutation(({ input }: any) => {
      const { id, ...data } = input;
      return model.update({ where: { id }, data });
    }),
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => model.delete({ where: { id: input.id } })),
    toggle: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const current = await model.findUnique({ where: { id: input.id } });
        return model.update({
          where: { id: input.id },
          data: { active: !current?.active },
        });
      }),
  });

export const appRouter = router({
  basicInfo: crud(
    prisma.basicInfo,
    z.object({
      key: z.string().min(1),
      value: z.string(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      key: z.string().optional(),
      value: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
  experience: crud(
    prisma.experience,
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.string().optional(),
      description: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      company: z.string().optional(),
      role: z.string().optional(),
      period: z.string().optional(),
      description: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
  project: crud(
    prisma.project,
    z.object({
      slug: z.string(),
      title: z.string(),
      excerpt: z.string().optional(),
      content: z.string(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      slug: z.string().optional(),
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
  skillGroup: crud(
    prisma.skillGroup,
    z.object({
      name: z.string(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      name: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
  skill: crud(
    prisma.skill,
    z.object({
      name: z.string(),
      groupId: z.string(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      name: z.string().optional(),
      groupId: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
  education: crud(
    prisma.education,
    z.object({
      degree: z.string(),
      institution: z.string().optional(),
      period: z.string().optional(),
      description: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      degree: z.string().optional(),
      institution: z.string().optional(),
      period: z.string().optional(),
      description: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
  language: crud(
    prisma.language,
    z.object({
      name: z.string(),
      level: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
    z.object({
      id: z.string(),
      name: z.string().optional(),
      level: z.string().optional(),
      sortOrder: z.number().int().optional(),
      active: z.boolean().optional(),
    }),
  ),
});

export type AppRouter = typeof appRouter;
