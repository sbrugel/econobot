import { Command } from "../../typings/bot/command";
import { APIEmbedField, ApplicationCommandOptionData, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";

export default class extends Command {
    name = 'viewstore';
    description = 'View what items are in the store.';
    options: ApplicationCommandOptionData[] = [
        {
            name: 'page', // collectible, message, role
            description: `The page number`,
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ]

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const serverData: Guild = await interaction.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: interaction.guildId });
        const items = serverData.serverStore.items;

        let fields: APIEmbedField[] = []; // for created embed

        const currentPage = interaction.options.getNumber('page');
        const idLowerBound = (currentPage - 1) * 5;
        const idUpperBound = (currentPage * 5) - 1; // included in the range

        const displayItems = items.filter(i => i.id >= idLowerBound && i.id <= idUpperBound);
        for (const item of displayItems) {
            fields.push({ name: item.name, value: `**Cost:** ${item.cost}, **Stock:** ${item.stock !== -1 ? item.stock : `Unlimited`}, **Type:** ${item.type}`});
        }

        // TODO: pagination with buttons (tried previously but there were form body errors)
        if (displayItems.length === 0 || currentPage < 1) return interaction.reply({ content: `No items on this page! Valid pages are 1 to ${Math.ceil(items.length / 5)}.`, ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`Items in ${interaction.guild.name}'s Store`)
            .addFields(fields)
            .setFooter({ text: `Page ${currentPage} of ${Math.ceil(items.length / 5)}` })

        return interaction.reply({ embeds: [embed] });
    }
}