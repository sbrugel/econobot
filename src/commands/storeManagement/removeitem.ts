import { Command } from "../../typings/bot/command";
import { ApplicationCommandOptionData, ApplicationCommandOptionType, ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";

export default class extends Command {
    name = 'removeitem';
    description = 'Remove an item from the store.';
    options: ApplicationCommandOptionData[] = [
        {
            name: 'name',
            description: 'The name of the item',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const serverData: Guild = await interaction.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: interaction.guildId });
        const name = interaction.options.getString('name');

        // check if in store
        if (serverData.serverStore.items.filter(i => i.name === name).length === 0) {
            return interaction.reply({ content: `Item ${name} isn't in the store!`, ephemeral: true });
        }

        // remove the item
        await interaction.client.mongo.collection<Guild>(DB.COLLECTION).updateOne(
            { guildId: interaction.guildId }, 
            { $set: { 'serverStore.items': serverData.serverStore.items.filter(i => i.name !== name) }}
        );

        interaction.reply(`Item ${name} is no longer in the store!`);
    }
}