import { NextResponse } from "next/server";
import { prisma } from "~/server/db";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id"));
  const kind = String(form.get("kind"));
  if (kind === "project") {
    const p = await prisma.project.findUnique({ where: { id } });
    if (p)
      await prisma.project.update({
        where: { id },
        data: { active: !p.active },
      });
  } else {
    const i = await prisma.resumeItem.findUnique({ where: { id } });
    if (i)
      await prisma.resumeItem.update({
        where: { id },
        data: { active: !i.active },
      });
  }
  return NextResponse.redirect(new URL("/fa/admin", req.url));
}
