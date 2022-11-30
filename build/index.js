"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_1 = require("./discord");
const tg_1 = require("./tg");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const main = async (e) => {
    console.log("Run Started");
    const telegram = await (0, tg_1.telegramInit)();
    const discord = await (0, discord_1.discordInit)();
    while (await (0, tg_1.fetchMessagesFromChannel)(telegram, "iedckerala", async (e, f) => (0, discord_1.forwardMessages)(discord, e, f)))
        ;
    (0, tg_1.endOpes)();
    console.log("Run complete");
};
// app.lib.cron(main);
const run = async (e) => {
    console.log("Server Started - LOL!");
    setInterval(main, 60 * 1 * 1000);
};
run();
