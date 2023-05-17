import { Command } from "../../interfaces/command";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/Guild";
import { ApplicationCommandOptionData } from 'discord.js';

export default class extends Command {
    name = 'setname';
    description = 'Set the name of the server currency.';
    options: ApplicationCommandOptionData[] = [
        {
            name: 'name',
            description: 'The desired name',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const newName = interaction.options.getString('name');
        await interaction.client.mongo.collection<Guild>(DB.COLLECTION).updateOne({ guildId: interaction.guildId }, { $set: { currencyName: newName }});
        return interaction.reply({ content: `\`${interaction.guild.name}\`'s currency name is now ${newName}.` });
    }
}