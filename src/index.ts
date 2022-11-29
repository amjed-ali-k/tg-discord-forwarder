import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input"; // npm i input
const path = require("path");
import { promises as fs } from "fs";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const stringSession = new StringSession(process.env.SESSION_STRING);
const apiID = process.env.TELEGRAM_API_ID || "";
const apiHash = process.env.TELGRAM_API_KEY || "";

(async () => {
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, parseInt(apiID), apiHash, {
    connectionRetries: 5,
  });
  // await client.start({
  //   phoneNumber: async () => await input.text("number ?"),
  //   password: async () => await input.text("password?"),
  //   phoneCode: async () => await input.text("Code ?"),
  //   onError: (err) => console.log(err),
  // });
  // console.log(client.session.save()); // Save this string to avoid logging in again
  if (!client.connected) {
    await client.connect();
  }
  console.log("You should now be connected.");

  const ids = [172];
  const result = await client.invoke(
    new Api.channels.GetMessages({
      channel: "iedckerala",
      id: [...(ids as unknown as Api.TypeInputMessage[])],
    })
  );

  if (result.className !== "messages.ChannelMessages") return;
  result.messages.forEach(async (e) => {
    if (e.className !== "Message") return;
    const { message, media } = e;
    console.log("Message: " + message);
    if (
      media &&
      media.className &&
      ["MessageMediaPhoto"].includes(media.className)
    ) {
      await client.downloadMedia(e, {
        outputFile: `${__dirname}/downloads/${e.id}.${
          media.className === "MessageMediaPhoto" ? "jpg" : "pdf"
        }`,
      });
    }
  });

  // console.log(result); // prints the result
})();
