"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessagesFromChannel = exports.telegramInit = exports.endOpes = exports.lastRunArr = void 0;
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const deta_1 = require("deta");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const stringSession = new sessions_1.StringSession(process.env.SESSION_STRING);
const apiID = process.env.TELEGRAM_API_ID || "";
const apiHash = process.env.TELGRAM_API_KEY || "";
const deta = (0, deta_1.Deta)(process.env.DETA_PROJECT_KEY || "");
const tgMsgDb = deta.Base("tg_channel_messages");
const tgInfo = deta.Base("tg_channel_info");
const saveLocation = {
    deta: "/tmp",
    local: `${__dirname}/downloads`,
};
exports.lastRunArr = [];
const endOpes = () => {
    exports.lastRunArr = [];
};
exports.endOpes = endOpes;
const telegramInit = async () => {
    const telegram = new telegram_1.TelegramClient(stringSession, parseInt(apiID), apiHash, {
        connectionRetries: 5,
    });
    if (!telegram.connected) {
        await telegram.connect();
    }
    return telegram;
};
exports.telegramInit = telegramInit;
const fetchMessagesFromChannel = async (telegram, channelId, onMessage) => {
    const lastMessage = (await tgInfo.get(channelId))?.lastMessageId || "172";
    const ids = Array(5)
        .fill(0)
        .map((_e, i) => {
        const index = parseInt(lastMessage) + i + 1;
        return index;
    })
        .filter((e) => !exports.lastRunArr.includes(e));
    console.log("IDS", ids);
    if (ids.length === 0)
        return 0;
    const result = await telegram.invoke(new telegram_1.Api.channels.GetMessages({
        channel: channelId,
        id: [...ids],
    }));
    let url = undefined;
    if (result.className !== "messages.ChannelMessages")
        return;
    let count = 0;
    const res = await Promise.all(result.messages.map(async (e) => {
        exports.lastRunArr.push(e.id);
        if (e.className !== "Message")
            return;
        const { message, media } = e;
        if (media &&
            media.className &&
            ["MessageMediaPhoto"].includes(media.className)) {
            url = `${saveLocation.local}/${e.id}.${media.className === "MessageMediaPhoto" ? "jpg" : "pdf"}`;
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
    }));
    return count;
};
exports.fetchMessagesFromChannel = fetchMessagesFromChannel;
