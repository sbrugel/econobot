import { ApplicationCommand, Client, Collection, Guild } from "discord.js";
import { Command } from "../interfaces/command";
import { readdirRecursive } from "../utils/utils";

async function register(client: Client) {
    try {
        await loadCommands(client);
    } catch (error) {
        console.log(error);
    }
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

        console.log(`\t${awaitedCommands.length} command(s) have been loaded`)
    }
}

export default register;