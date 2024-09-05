import type { Bot } from "grammy";

declare global {
  namespace NodeJS {
    interface Global {
      bot: Bot | undefined;
    }
  }
}
