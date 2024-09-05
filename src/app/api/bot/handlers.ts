import { Bot, type Context } from "grammy";
import { start } from "./command/start";

type Self = { bot: Bot | undefined } & typeof globalThis;

const self: Self = { ...global, bot: undefined };

if (!self.bot) {
  self.bot = new Bot<Context>(process.env.TELEGRAM_BOT_TOKEN ?? "");
}

if (self.bot) {
  self.bot.on("message:text", async (ctx: Context) => {
    switch (ctx.message?.text) {
      case "/start": {
        await start(ctx);
        break;
      }
      default:
        await ctx.reply(`Unsuported command: ${ctx.message?.text}`);
    }
  });
}

export const getInstance = (): Self["bot"] => {
  return self.bot;
};
