import { discordInit, forwardMessages } from "./discord";
import { endOpes, fetchMessagesFromChannel, telegramInit } from "./tg";

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
  endOpes();
  console.log("Run complete");
};

// app.lib.cron(main);

const run = async (e?: any) => {
  setInterval(main, 10000);
};
run();
