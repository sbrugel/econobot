import DiscordJS, { ActivityType, Client, IntentsBitField } from 'discord.js';
import { BOT } from './config';
import { readdirRecursive } from './utils/utils';

const client = new DiscordJS.Client({
    intents: [
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
});

// TODO: database connection

client.login(BOT.TOKEN);

client.once('ready', async () => {
    // load pieces (messageListener, commandManager)
    const pieceFiles = readdirRecursive(`${__dirname}/pieces`);
    for (const file of pieceFiles) {
        const piece = await import(file);
        const name = file.split('/')[file.split('/').length - 1].split('.')[0];
        piece.default(client); // runs the function exported by default
        console.log(`Loaded piece: ${name}`);
    }

    client.user.setActivity(`messages`, { type: ActivityType.Listening });

    console.log(`Ready!`);
});