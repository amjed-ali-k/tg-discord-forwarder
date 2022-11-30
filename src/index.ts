import { discordInit, forwardMessages } from "./discord";
import { endOpes, fetchMessagesFromChannel, telegramInit } from "./tg";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const main = async (e?: any) => {
  console.log("Run Started");
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
  console.log("Server Started - LOL!");
  setInterval(main, 60 * 1 * 1000);
};
run();
