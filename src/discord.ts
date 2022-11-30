import { Client, GatewayIntentBits, TextChannel } from "discord.js";

export const discordInit = async () => {
  const discord = new Client({ intents: [GatewayIntentBits.Guilds] });
  discord.login(process.env.DISCORD_TOKEN);
  return discord;
};

export const getForwardDestinations = async (
  discord: Client
): Promise<TextChannel[]> => {
  const iedcFwdMesgsChannel = (await discord.channels.fetch(
    "1047056089348309043",
    {
      force: true,
      allowUnknownGuild: true,
    }
  )) as TextChannel;
  return [iedcFwdMesgsChannel];
};

export const forwardMessages = async (
  discord: Client,
  message: string,
  file?: string
) => {
  const dest = (await getForwardDestinations(discord)).at(0);
  if (!file) {
    dest.send(message);
  } else {
    dest.send({
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
