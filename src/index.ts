import { discordInit, forwardMessages } from "./discord";
import { fetchMessagesFromChannel, telegramInit } from "./tg";
// import { app } from "deta";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const main = async (e?: any) => {
  const telegram = await telegramInit();
  const discord = await discordInit();
  while (
    (await fetchMessagesFromChannel(telegram, "iedckerala", async (e, f) =>
      forwardMessages(discord, e, f)
    )) > 0
  );
  // console.log("FINISHED");
};

// app.lib.cron(main);

if (process.env.NODE_ENV !== "production") {
  main();
}
