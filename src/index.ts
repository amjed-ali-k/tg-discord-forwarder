import { discordInit, forwardMessages } from "./discord";
import { fetchMessagesFromChannel, telegramInit } from "./tg";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const main = async () => {
  const telegram = await telegramInit();
  const discord = await discordInit();
  while (
    (await fetchMessagesFromChannel(telegram, "iedckerala", async (e, f) =>
      forwardMessages(discord, e, f)
    )) > 0
  );
  // console.log("FINISHED");
};

main();
