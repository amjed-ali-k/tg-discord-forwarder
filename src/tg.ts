import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Deta } from "deta";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const stringSession = new StringSession(process.env.SESSION_STRING);
const apiID = process.env.TELEGRAM_API_ID || "";
const apiHash = process.env.TELGRAM_API_KEY || "";
const deta = Deta(process.env.DETA_PROJECT_KEY || "");

const tgMsgDb = deta.Base("tg_channel_messages");
const tgInfo = deta.Base("tg_channel_info");

const saveLocation = {
  deta: "/tmp",
  local: `${__dirname}/downloads`,
};

export const telegramInit = async () => {
  const telegram = new TelegramClient(stringSession, parseInt(apiID), apiHash, {
    connectionRetries: 5,
  });
  if (!telegram.connected) {
    await telegram.connect();
  }
  return telegram;
};

export const fetchMessagesFromChannel = async (
  telegram: TelegramClient,
  channelId: string,
  onMessage: (message: string, imageLoc?: string) => Promise<void>
) => {
  const lastMessage =
    ((await tgInfo.get(channelId)).lastMessageId as string) || "172";
  const ids = Array(5)
    .fill(0)
    .map((e, i) => {
      return parseInt(lastMessage) + i + 1;
    });

  const result = await telegram.invoke(
    new Api.channels.GetMessages({
      channel: channelId,
      id: [...(ids as unknown as Api.TypeInputMessage[])],
    })
  );
  let url: string = null;
  if (result.className !== "messages.ChannelMessages") return;
  let count = 0;
  const res = await Promise.all(
    result.messages.map(async (e) => {
      if (e.className !== "Message") return;
      const { message, media } = e;
      if (
        media &&
        media.className &&
        ["MessageMediaPhoto"].includes(media.className)
      ) {
        url = `${saveLocation[process.env.TELGRAM_API_KEY || "deta"]}/${e.id}.${
          media.className === "MessageMediaPhoto" ? "jpg" : "pdf"
        }`;
        await telegram.downloadMedia(e, {
          outputFile: url,
        });
      }
      await onMessage(message, url);
      // console.log("Fetched - " + e.id + " -");
      await tgMsgDb.put({
        key: e.id.toString(),
        channelId: channelId,
        time: new Date().getTime(),
      });
      await tgInfo.put({
        key: channelId,
        lastMessageId: e.id,
      });
      return count++;
    })
  );

  return count;
};
