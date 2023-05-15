import DiscordJS, { Intents } from 'discord.js';
import { BOT } from './config';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.login(BOT.TOKEN);

client.on('ready', async () => {
    console.log('hello world');
});