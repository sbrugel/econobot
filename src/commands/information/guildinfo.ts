import { Command } from "../../typings/bot/command";
import { ChatInputCommandInteraction, EmbedBuilder, InteractionResponse } from 'discord.js';
import { DB } from '../../config';
import { Guild } from "../../typings/db/Guild";

export default class extends Command {
    name = 'guildinfo';
    description = 'Display currency information for this server.';

    async run(interaction: ChatInputCommandInteraction): Promise<InteractionResponse<boolean> | void> {
        const serverData: Guild = await interaction.client.mongo.collection<Guild>(DB.COLLECTION).findOne({ guildId: interaction.guildId });

        const displayEmbed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(`Currency Info for ${interaction.guild.name}`)
            .setThumbnail(serverData.currencyIcon)
            .addFields(
                { name: 'Name', value: serverData.currencyName },
                { name: 'Awards posted publicly?', value: serverData.publicAwardAnnounce ? 'Yes' : 'No' },
            )

        return interaction.reply({ embeds: [displayEmbed], ephemeral: true });
    }
}