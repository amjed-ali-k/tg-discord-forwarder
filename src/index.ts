import { discordInit, forwardMessages } from "./discord";
import { fetchMessagesFromChannel, telegramInit } from "./tg";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const main = async (e?: any) => {
  const telegram = await telegramInit();
  const discord = await discordInit();
  while (
    await fetchMessagesFromChannel(telegram, "iedckerala", async (e, f) =>
      forwardMessages(discord, e, f)
    )
  );
};

// app.lib.cron(main);

const run = async (e?: any) => {
  setInterval(main, 2 * 60 * 1000);
};

run();
