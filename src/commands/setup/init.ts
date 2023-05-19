import { Command } from "../../typings/bot/command";
import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";

export default class extends Command {
    name = 'init';
    description = 'Set up this bot for use in this server.';

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const serverData = await interaction.client.mongo.collection(DB.COLLECTION).findOne({ guildId: interaction.guildId });

        if (!serverData) {
            const newServerData: Guild = { // create a new entry for this server with default fields
                guildId: interaction.guildId,
                currencyName: 'Coin',
                currencyIcon: 'https://tenor.com/view/bennet-coin-bennet-coin-bennet-coin-pink-gif-22882734',
                publicAwardAnnounce: true,
                users: [],
                items: []
            }

            await interaction.client.mongo.collection(DB.COLLECTION).insertOne(newServerData)
                .then(() => {
                    return interaction.reply(`Success! \`${interaction.guild.name}\` is now set up. Use /guildinfo to see currency information.`);
                })
                .catch((err) => {
                    return interaction.reply(`Sorry, an error occurred while setting up \`${interaction.guild.name}\`: ${err}`);
                })
        } else {
            return interaction.reply({ content: `This server is already set up!`, ephemeral: true });
        }
        
        
    }
}