import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { analyticsPath } from "~/server/analytics";
import { adminProcedure, publicProcedure, router } from "~/server/api/trpc";

const statusSchema = z.enum(["pending", "contacted", "ignored", "resolved"]);
const contactIdSchema = z.object({ id: z.string().cuid() });
const pageSize = 20;

export const contactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1).max(120),
        email: z
          .string()
          .trim()
          .email()
          .max(254)
          .transform((value) => value.toLowerCase()),
        subject: z.string().trim().min(1).max(200),
        message: z.string().trim().min(1).max(5000),
        website: z.string().max(500).optional(),
        visitorId: z.string().uuid().optional(),
        sessionId: z.string().uuid().optional(),
        path: z.string().min(1).max(1024),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.website) return { success: true as const };
      const path = analyticsPath(input.path);
      if (!path) throw new TRPCError({ code: "BAD_REQUEST" });
      await ctx.prisma.$transaction(async (transaction) => {
        const now = Date.now();
        const recent = await transaction.contact.count({
          where: {
            OR: [
              {
                email: input.email,
                createdAt: { gte: new Date(now - 60_000) },
              },
              ...(input.visitorId
                ? [
                    {
                      visitorId: input.visitorId,
                      createdAt: { gte: new Date(now - 60_000) },
                    },
                  ]
                : []),
            ],
          },
        });
        const hourly = await transaction.contact.count({
          where: { createdAt: { gte: new Date(now - 3_600_000) } },
        });
        if (recent || hourly >= 100)
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Please try again later.",
          });
        await transaction.contact.create({
          data: {
            name: input.name,
            email: input.email,
            subject: input.subject,
            message: input.message,
            visitorId: input.visitorId,
            sessionId: input.visitorId ? input.sessionId : undefined,
            path,
          },
        });
      });
      return { success: true as const };
    }),

  count: adminProcedure.query(({ ctx }) => ctx.prisma.contact.count()),

  list: adminProcedure
    .input(
      z.object({
        status: statusSchema.optional(),
        page: z.number().int().min(1).max(1_000_000),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = { status: input.status };
      const [total, items] = await ctx.prisma.$transaction([
        ctx.prisma.contact.count({ where }),
        ctx.prisma.contact.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (input.page - 1) * pageSize,
          take: pageSize,
        }),
      ]);
      return {
        items: items.map((item) => ({
          ...item,
          status: statusSchema.parse(item.status),
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        })),
        total,
        pages: Math.max(1, Math.ceil(total / pageSize)),
      };
    }),

  updateStatus: adminProcedure
    .input(contactIdSchema.extend({ status: statusSchema }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.contact.updateMany({
        where: { id: input.id },
        data: { status: input.status },
      });
      if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
      return { success: true as const };
    }),

  logs: adminProcedure.input(contactIdSchema).query(async ({ ctx, input }) => {
    const contact = await ctx.prisma.contact.findUnique({
      where: { id: input.id },
    });
    if (!contact) throw new TRPCError({ code: "NOT_FOUND" });
    if (!contact.visitorId) return [];
    const logs = await ctx.prisma.analyticsLog.findMany({
      where: { visitorId: contact.visitorId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
    });
    return logs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    }));
  }),
});
