import { ApplicationCommand, CommandInteraction, Client, Collection, Guild } from "discord.js";
import { Command } from "../typings/bot/command";
import { Guild as GuildData } from "../typings/db/Guild";
import { readdirRecursive } from "../utils/utils";
import { DB } from "../config";

async function register(client: Client) {
    try {
        await loadCommands(client);
    } catch (error) {
        console.log(error);
    }

    client.on('interactionCreate', async interaction => {
        if (interaction.isChatInputCommand()) {
            const serverData: GuildData = await interaction.client.mongo.collection<GuildData>(DB.COLLECTION).findOne({ guildId: interaction.guildId });
            if (!serverData && interaction.commandName !== 'init') {
                interaction.reply({ content: `This server isn't set up yet! Run /init to do so.`, ephemeral: true });
                return;
            }
            runCommand(interaction as CommandInteraction, client);
        } 
    });
}

async function loadCommands(client: Client) {
    client.commands = new Collection();

    // TODO: make this application based once testing is done
    const { commands } = client.guilds.cache.get('679777315814637683') as Guild;
    
    const commandFiles = readdirRecursive(`${__dirname}/../commands`).filter(file => file.endsWith('.js'));
    const awaitedCommands: Promise<ApplicationCommand>[] = [];

    for (const file of commandFiles) {
        const commandModule = await import(file);

        const dirs = file.split('/');
		const name = dirs[dirs.length - 1].split('.')[0];

        if (!(typeof commandModule.default === 'function')) {
			console.log(`Invalid command ${name}`);
			continue;
		}

        const command: Command = new commandModule.default;

        command.name = name;

        const guildCmd = commands.cache.find(cmd => cmd.name === command.name);

        const cmdData = {
            name: command.name,
            description: command.description,
            options: command?.options || [],
            defaultPermission: true // allow commands to be used by anyone
        }

        if (!guildCmd) {
            awaitedCommands.push(commands.create(cmdData));
        } else {
            awaitedCommands.push(commands.edit(guildCmd.id, cmdData));
        }
        
        client.commands.set(name, command);
    }
    console.log(`\t${awaitedCommands.length} command(s) have been loaded`)
}

async function runCommand(interaction: CommandInteraction, client: Client) {
    const command = client.commands.get(interaction.commandName);

    if (command.run !== undefined) {
        // TODO: implement perms

        try {
            command.run(interaction)
                ?.catch(async (error: Error) => {
                    interaction.reply({ content: `Sorry, an error occurred: ${error}`, ephemeral: true });
                    console.log(error);
                })
        } catch (error) {
            console.log(`Error occurred while running command: ${error}`);
        }
    } else {
        interaction.reply({ content: `This command has not yet been implemented.`, ephemeral: true });
    }
}

export default register;