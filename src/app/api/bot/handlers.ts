import { Bot, type Context } from "grammy";
import { start } from "./command/start";

const bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN ?? "");

if (!("bot" in global) && !global.bot) {
  global.bot = bot;
}

if (bot) {
  bot.on("message:text", async (ctx) => {
    switch (ctx.message.text) {
      case "/start": {
        await start(ctx);
        break;
      }
      default:
        await ctx.reply(ctx.message.text);
    }
  });
}

export const getInstance = () => {
  return global.bot;
};
