import prisma from "@/db/prisma";
import type { Bot, Context } from "grammy";

export const start = async (ctx: Context) => {
  const userInfo = ctx.from;
  const smId = `telegram:${userInfo?.id}`;
  const userName = userInfo?.username;
  const fullName =
    `${userInfo?.first_name ?? ""} ${userInfo?.last_name ?? ""}`.trim();

  const existsUser = await prisma.user.findFirst({ where: { smId } });

  if (existsUser) {
    console.log("User already exists", existsUser);
    return ctx.reply(`Welcome back @${userName}`);
  }

  const user = await prisma.user.create({
    data: { smId, name: fullName || userName || "N/A" },
  });
  console.log({ user });

  return ctx.reply(`Welcome @${userName}\nAdded to DB`);
};
