import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Bot, BotError, webhookCallback } from "grammy";
import { getInstance } from "./handlers";

const bot = getInstance();

const handleGracefulShutdown = async () => {
  console.log("stopping bot ...");

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

export const GET = async (req: NextApiRequest) => {
  try {
    if (process.env.NODE_ENV === "development") {
      const searchParams = req.url ? new URL(req.url)?.searchParams : undefined;

      if (searchParams && searchParams.get("action") !== "start") {
        return NextResponse.json(
          { error: { message: "Wrong gateway." } },
          { status: 500 },
        );
      }
      console.log("starting bot...");

      if (!bot?.isInited()) {
        bot?.start().then(console.log);
      }
      return NextResponse.json({ success: true, isInited: bot?.isInited() });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof BotError) {
      return NextResponse.json({ botError: e });
    }
    return NextResponse.json({ error: e });
  }
};

// export const POST = webhookCallback(bot, "std/http");
