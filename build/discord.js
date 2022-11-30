"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardMessages = exports.getForwardDestinations = exports.discordInit = void 0;
const discord_js_1 = require("discord.js");
const discordInit = async () => {
    const discord = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
    discord.login(process.env.DISCORD_TOKEN);
    return discord;
};
exports.discordInit = discordInit;
const getForwardDestinations = async (discord) => {
    const iedcFwdMesgsChannel = (await discord.channels.fetch("1047056089348309043", {
        force: true,
        allowUnknownGuild: true,
    }));
    return [iedcFwdMesgsChannel];
};
exports.getForwardDestinations = getForwardDestinations;
const forwardMessages = async (discord, message, file) => {
    const dest = (await (0, exports.getForwardDestinations)(discord)).at(0);
    if (!file) {
        if (message === "")
            return;
        dest?.send(message);
    }
    else {
        dest?.send({
            files: [
                {
                    attachment: file,
                    name: "file.jpg",
                    description: message,
                },
            ],
            content: message,
        });
    }
};
exports.forwardMessages = forwardMessages;
