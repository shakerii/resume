import { router } from "~/server/api/trpc";
import { adminRouter } from "~/server/api/routers/admin";
import { basicInfoRouter } from "~/server/api/routers/basic-info";
import { educationRouter } from "~/server/api/routers/education";
import { experienceRouter } from "~/server/api/routers/experience";
import { languageRouter } from "~/server/api/routers/language";
import { projectRouter } from "~/server/api/routers/project";
import { skillRouter } from "~/server/api/routers/skill";
import { skillGroupRouter } from "~/server/api/routers/skill-group";

export const appRouter = router({
  admin: adminRouter,
  basicInfo: basicInfoRouter,
  experience: experienceRouter,
  project: projectRouter,
  skillGroup: skillGroupRouter,
  skill: skillRouter,
  education: educationRouter,
  language: languageRouter,
});

export type AppRouter = typeof appRouter;
