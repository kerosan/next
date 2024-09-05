import { type NextRequest, NextResponse } from "next/server";
import { Bot, BotError, webhookCallback } from "grammy";
import { getInstance } from "./handlers";

const bot = getInstance();

const handleGracefulShutdown = async () => {
  await bot?.stop();
  process.exit();
};

if (process.env.NODE_ENV === "development") {
  // Graceful shutdown handlers
  process.once("SIGTERM", handleGracefulShutdown);
  process.once("SIGINT", handleGracefulShutdown);
}

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

export const GET =
  process.env.NODE_ENV === "development"
    ? (req: NextRequest) => {
        try {
          if (process.env.NODE_ENV === "development") {
            const searchParams = req.url
              ? new URL(req.url)?.searchParams
              : null;

            if (searchParams && searchParams.get("action") !== "start") {
              throw NextResponse.json(
                { error: { message: "Wrong gateway." } },
                { status: 500 },
              );
            }
            console.log("starting bot...", { bot, isInited: bot?.isInited() });

            if (bot && !bot?.isInited()) {
              console.log("Bot = ", bot);

              bot.start().then(console.log).catch(console.error);
            }
            const res = { success: true, isInited: bot?.isInited() };
            console.log("Res:", { res });

            return NextResponse.json(res);
          }
        } catch (e) {
          console.error("Catch bot", e);
          if (e instanceof BotError) {
            throw NextResponse.json({ botError: e });
          }
          throw NextResponse.json({ error: e });
        }
      }
    : () => console.warn("Dev: Failed to start bot");

export const POST =
  process.env.NODE_ENV === "development"
    ? () => console.warn("Prod: Failed to start bot")
    : bot
      ? webhookCallback(bot, "std/http")
      : () => console.warn("Prod: Failed to start bot");
